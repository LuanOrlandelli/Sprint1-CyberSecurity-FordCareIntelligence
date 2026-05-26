package fordcare_api.controller;

import fordcare_api.entity.Recommendation;
import fordcare_api.repository.RecommendationRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recommendations")
public class RecommendationController {

    private final RecommendationRepository recommendationRepository;

    public RecommendationController(RecommendationRepository recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    @GetMapping("/{customerId}")
    public Recommendation getRecommendationByCustomerId(@PathVariable Long customerId) {
        return recommendationRepository.findTopByCustomerIdOrderByCreatedAtDesc(customerId)
                .orElseThrow(() -> new RuntimeException("Recomendação não encontrada"));
    }
}