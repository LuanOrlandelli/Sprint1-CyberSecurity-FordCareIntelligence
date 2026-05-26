package fordcare_api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "dealership_id")
    private Long dealershipId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}