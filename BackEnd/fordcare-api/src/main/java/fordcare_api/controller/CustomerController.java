package fordcare_api.controller;

import fordcare_api.dto.response.CustomerDetailResponse;
import fordcare_api.service.CustomerService;
import org.springframework.web.bind.annotation.*;
import fordcare_api.dto.response.CustomerListResponse;
import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<CustomerListResponse> listCustomers() {
        return customerService.listCustomers();
    }

    @GetMapping("/{id}")
    public CustomerDetailResponse getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerDetails(id);
    }
}