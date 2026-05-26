package fordcare_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class CustomerListResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;

    private String vehicleModel;
    private Integer vehicleYear;

    private String riskLevel;
    private BigDecimal riskScore;
}