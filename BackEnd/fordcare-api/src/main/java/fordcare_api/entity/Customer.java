package fordcare_api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String cpf;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "dealership_id")
    private Long dealershipId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}