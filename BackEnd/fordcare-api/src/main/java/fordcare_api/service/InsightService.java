package fordcare_api.service;

import fordcare_api.dto.response.DashboardResponse;
import fordcare_api.entity.Customer;
import fordcare_api.entity.Prediction;
import fordcare_api.repository.CustomerRepository;
import fordcare_api.repository.LeadRepository;
import fordcare_api.repository.PredictionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InsightService {

    private final CustomerRepository customerRepository;
    private final PredictionRepository predictionRepository;
    private final LeadRepository leadRepository;

    public InsightService(
            CustomerRepository customerRepository,
            PredictionRepository predictionRepository,
            LeadRepository leadRepository
    ) {
        this.customerRepository = customerRepository;
        this.predictionRepository = predictionRepository;
        this.leadRepository = leadRepository;
    }

    public DashboardResponse getDashboard() {
        List<Customer> customers = customerRepository.findAll();

        Long totalCustomers = (long) customers.size();

        Long highRiskCustomers = 0L;
        Long mediumRiskCustomers = 0L;
        Long lowRiskCustomers = 0L;

        for (Customer customer : customers) {
            Prediction latestPrediction = predictionRepository
                    .findTopByCustomerIdOrderByCreatedAtDesc(customer.getId())
                    .orElse(null);

            if (latestPrediction == null) {
                continue;
            }

            switch (latestPrediction.getRiskLevel()) {
                case "HIGH" -> highRiskCustomers++;
                case "MEDIUM" -> mediumRiskCustomers++;
                case "LOW" -> lowRiskCustomers++;
            }
        }

        Long totalLeads = leadRepository.count();
        Long newLeads = leadRepository.countByStatus("NEW");

        return new DashboardResponse(
                totalCustomers,
                highRiskCustomers,
                mediumRiskCustomers,
                lowRiskCustomers,
                totalLeads,
                newLeads
        );
    }
}