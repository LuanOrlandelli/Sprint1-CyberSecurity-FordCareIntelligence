package fordcare_api.dto.response;

import fordcare_api.entity.Customer;
import fordcare_api.entity.Prediction;
import fordcare_api.entity.Recommendation;
import fordcare_api.entity.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomerDetailResponse {

    private Customer customer;
    private Vehicle vehicle;
    private Prediction prediction;
    private Recommendation recommendation;
}