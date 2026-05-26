package fordcare_api.repository;

import fordcare_api.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    Long countByStatus(String status);
}