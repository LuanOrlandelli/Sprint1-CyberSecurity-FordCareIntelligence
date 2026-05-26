package fordcare_api.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI fordCareOpenAPI() {

        String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("FordCare Intelligence API")
                        .description(
                                "Sistema inteligente de retenção pós-venda Ford, " +
                                        "com análise de clientes, leads, recomendações e predições com IA."
                        )
                        .version("v1.0")
                        .contact(new Contact()
                                .name("Equipe FordCare Intelligence")
                                .email("contato@fordcare.com")
                        )
                )
                .externalDocs(new ExternalDocumentation()
                        .description("Documentação do Projeto")
                        .url("http://localhost:8080/swagger-ui.html")
                )
                .addSecurityItem(new SecurityRequirement()
                        .addList(securitySchemeName)
                )
                .components(new Components()
                        .addSecuritySchemes(
                                securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )
                );
    }
}