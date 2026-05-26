package fordcare_api.controller;

import fordcare_api.entity.Customer;
import fordcare_api.service.DataPrivacyService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/privacy")
public class DataPrivacyController {

    private final DataPrivacyService dataPrivacyService;

    public DataPrivacyController(DataPrivacyService dataPrivacyService) {
        this.dataPrivacyService = dataPrivacyService;
    }

    @PutMapping("/customers/{id}/anonymize")
    public Customer anonymizeCustomer(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        return dataPrivacyService.anonymizeCustomer(
                id,
                httpRequest.getRemoteAddr()
        );
    }
}