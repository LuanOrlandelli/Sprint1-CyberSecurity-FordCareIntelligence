package fordcare_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardResponse {

    private Long totalCustomers;
    private Long highRiskCustomers;
    private Long mediumRiskCustomers;
    private Long lowRiskCustomers;
    private Long totalLeads;
    private Long newLeads;
}