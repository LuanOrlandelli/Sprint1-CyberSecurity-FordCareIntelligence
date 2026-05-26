package fordcare_api.controller;

import fordcare_api.dto.request.LeadCreateRequest;
import fordcare_api.dto.request.LeadStatusUpdateRequest;
import fordcare_api.dto.response.LeadResponse;
import fordcare_api.entity.Lead;
import fordcare_api.service.LeadService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public List<LeadResponse> listLeads() {
        return leadService.listLeads();
    }

    @PostMapping
    public Lead createLead(
            @Valid @RequestBody LeadCreateRequest request,
            HttpServletRequest httpRequest
    ) {
        return leadService.createLead(request, httpRequest);
    }

    @PutMapping("/{id}/status")
    public Lead updateLeadStatus(
            @PathVariable Long id,
            @Valid @RequestBody LeadStatusUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        return leadService.updateLeadStatus(id, request, httpRequest);
    }
}