package fordcare_api.service;

import fordcare_api.entity.Customer;
import fordcare_api.repository.CustomerRepository;
import org.springframework.stereotype.Service;

@Service
public class DataPrivacyService {

    private final CustomerRepository customerRepository;
    private final AuditService auditService;

    public DataPrivacyService(
            CustomerRepository customerRepository,
            AuditService auditService
    ) {
        this.customerRepository = customerRepository;
        this.auditService = auditService;
    }

    public Customer anonymizeCustomer(Long customerId, String ipAddress) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        customer.setName("ANONYMIZED_CUSTOMER_" + customer.getId());
        customer.setEmail("anonymized_" + customer.getId() + "@fordcare.local");
        customer.setPhone("000000000");
        customer.setCpf("000.000.000-00");
        customer.setBirthDate(null);

        Customer savedCustomer = customerRepository.save(customer);

        auditService.register(
                "CUSTOMER_ANONYMIZED",
                "SYSTEM",
                "/privacy/customers/" + customerId + "/anonymize",
                ipAddress
        );

        return savedCustomer;
    }
}