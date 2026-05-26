package fordcare_api.repository;

import fordcare_api.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    Optional<Recommendation> findTopByCustomerIdOrderByCreatedAtDesc(Long customerId);
}