package fordcare_api.controller;

import fordcare_api.dto.request.PredictionClassifyRequest;
import fordcare_api.dto.response.PredictionClassifyResponse;
import fordcare_api.service.PredictionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/classify")
    public PredictionClassifyResponse classify(
            @Valid @RequestBody PredictionClassifyRequest request,
            HttpServletRequest httpRequest
    ) {
        return predictionService.classify(request, httpRequest);
    }
}