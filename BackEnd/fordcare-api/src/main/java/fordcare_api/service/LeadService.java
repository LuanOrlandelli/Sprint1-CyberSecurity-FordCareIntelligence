package fordcare_api.service;

import fordcare_api.dto.request.LeadCreateRequest;
import fordcare_api.dto.request.LeadStatusUpdateRequest;
import fordcare_api.entity.Lead;
import fordcare_api.repository.LeadRepository;
import fordcare_api.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import fordcare_api.dto.response.LeadResponse;
import fordcare_api.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;
    private final AuditService auditService;
    private static final Logger logger =
            LoggerFactory.getLogger(LeadService.class);

    public LeadService(
            LeadRepository leadRepository,
            CustomerRepository customerRepository,
            AuditService auditService
    ) {
        this.leadRepository = leadRepository;
        this.customerRepository = customerRepository;
        this.auditService = auditService;
    }
    public List<LeadResponse> listLeads() {
        return leadRepository.findAll()
                .stream()
                .map(lead -> {
                    String customerName = customerRepository.findById(lead.getCustomerId())
                            .map(customer -> customer.getName())
                            .orElse("Cliente não encontrado");

                    return new LeadResponse(
                            lead.getId(),
                            lead.getCustomerId(),
                            customerName,
                            lead.getDealershipId(),
                            lead.getStatus(),
                            lead.getOrigin(),
                            lead.getNotes(),
                            lead.getCreatedAt(),
                            lead.getUpdatedAt()
                    );
                })
                .toList();
    }

    public Lead createLead(LeadCreateRequest request, HttpServletRequest httpRequest) {
        Lead lead = new Lead();
        lead.setCustomerId(request.getCustomerId());
        lead.setDealershipId(request.getDealershipId());
        lead.setStatus("NEW");
        lead.setOrigin(SecurityUtils.sanitize(request.getOrigin()));
        lead.setNotes(SecurityUtils.sanitize(request.getNotes()));
        lead.setCreatedAt(LocalDateTime.now());
        lead.setUpdatedAt(LocalDateTime.now());

        Lead savedLead = leadRepository.save(lead);

        logger.info(
                "Lead criado com sucesso. leadId={}, customerId={}, dealershipId={}, origin={}",
                savedLead.getId(),
                savedLead.getCustomerId(),
                savedLead.getDealershipId(),
                savedLead.getOrigin()
        );

        auditService.register(
                "LEAD_CREATED",
                "SYSTEM",
                "/leads",
                httpRequest.getRemoteAddr()
        );

        return savedLead;
    }

    public Lead updateLeadStatus(Long id, LeadStatusUpdateRequest request, HttpServletRequest httpRequest) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead não encontrado"));

        lead.setStatus(request.getStatus());
        lead.setUpdatedAt(LocalDateTime.now());

        Lead updatedLead = leadRepository.save(lead);

        logger.info(
                "Status do lead atualizado. leadId={}, novoStatus={}",
                updatedLead.getId(),
                updatedLead.getStatus()
        );

        auditService.register(
                "LEAD_STATUS_UPDATED",
                "SYSTEM",
                "/leads/" + id + "/status",
                httpRequest.getRemoteAddr()
        );

        return updatedLead;
    }
}