package fordcare_api.service;

import fordcare_api.dto.response.CustomerDetailResponse;
import fordcare_api.entity.Customer;
import fordcare_api.entity.Prediction;
import fordcare_api.entity.Recommendation;
import fordcare_api.entity.Vehicle;
import fordcare_api.repository.CustomerRepository;
import fordcare_api.repository.PredictionRepository;
import fordcare_api.repository.RecommendationRepository;
import fordcare_api.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import fordcare_api.dto.response.CustomerListResponse;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    private final PredictionRepository predictionRepository;
    private final RecommendationRepository recommendationRepository;

    public CustomerService(
            CustomerRepository customerRepository,
            VehicleRepository vehicleRepository,
            PredictionRepository predictionRepository,
            RecommendationRepository recommendationRepository
    ) {
        this.customerRepository = customerRepository;
        this.vehicleRepository = vehicleRepository;
        this.predictionRepository = predictionRepository;
        this.recommendationRepository = recommendationRepository;
    }

    public List<CustomerListResponse> listCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(customer -> {
                    Vehicle vehicle = vehicleRepository.findByCustomerId(customer.getId())
                            .orElse(null);

                    Prediction prediction = predictionRepository
                            .findTopByCustomerIdOrderByCreatedAtDesc(customer.getId())
                            .orElse(null);

                    return new CustomerListResponse(
                            customer.getId(),
                            customer.getName(),
                            customer.getEmail(),
                            customer.getPhone(),
                            vehicle != null ? vehicle.getModel() : "Veículo não informado",
                            vehicle != null ? vehicle.getYear() : null,
                            prediction != null ? prediction.getRiskLevel() : "NOT_CLASSIFIED",
                            prediction != null ? prediction.getRiskScore() : null
                    );
                })
                .toList();
    }

    public CustomerDetailResponse getCustomerDetails(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Vehicle vehicle = vehicleRepository.findByCustomerId(id).orElse(null);
        Prediction prediction = predictionRepository.findTopByCustomerIdOrderByCreatedAtDesc(id).orElse(null);
        Recommendation recommendation = recommendationRepository.findTopByCustomerIdOrderByCreatedAtDesc(id).orElse(null);

        return new CustomerDetailResponse(customer, vehicle, prediction, recommendation);
    }
}