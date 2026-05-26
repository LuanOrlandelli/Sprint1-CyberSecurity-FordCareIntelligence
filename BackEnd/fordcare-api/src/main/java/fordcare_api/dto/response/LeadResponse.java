package fordcare_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class LeadResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private Long dealershipId;
    private String status;
    private String origin;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}