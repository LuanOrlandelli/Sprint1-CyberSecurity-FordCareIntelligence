package fordcare_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class PredictionClassifyResponse {

    private Long customerId;
    private BigDecimal riskScore;
    private String riskLevel;
    private String customerProfile;
    private String recommendation;
}