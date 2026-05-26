# FordCare Intelligence — Cybersecurity Compliance README

[Link do Drive com os dois arquivos caso de algo de errado com o repositório](https://drive.google.com/drive/folders/1QcTbsf1jYTTBUdSYyRw9Wuc0dRlwIdxO?usp=sharing)

## Visão Geral

O projeto **FordCare Intelligence** foi desenvolvido com foco em segurança desde a arquitetura inicial da solução. A plataforma combina aplicação mobile, API REST segura, controle de acesso corporativo, monitoramento operacional e proteção de dados sensíveis para atender aos requisitos da Sprint de Cybersecurity.

A arquitetura foi construída utilizando:

* Java 21 + Spring Boot 3
* Spring Security
* JWT Authentication
* PostgreSQL
* Flyway Migration
* Bucket4j Rate Limiter
* React Native + Expo
* Docker
* Swagger/OpenAPI

O objetivo deste documento é demonstrar tecnicamente como os requisitos de segurança solicitados foram atendidos no projeto.

---

# 1. Segurança de Entrada e Validação de Dados

## 1.1 Validação de entradas do usuário

Todas as entradas recebidas pela API passam por validação estruturada utilizando Bean Validation (`jakarta.validation`).

Exemplos implementados:

```java
@NotBlank(message = "O e-mail é obrigatório")
@Email(message = "Informe um e-mail válido")
@Size(max = 150)
private String email;
```

```java
@Size(max = 500, message = "As observações devem ter no máximo 500 caracteres")
private String notes;
```

As validações impedem:

* envio de payloads malformados;
* entradas vazias;
* formatos inválidos;
* excesso de caracteres;
* inconsistências de negócio.

---

## 1.2 Proteção contra SQL Injection

A aplicação utiliza:

* Spring Data JPA;
* Hibernate ORM;
* Repositories tipados.

Todas as consultas são realizadas por meio de parâmetros seguros do JPA, eliminando concatenação manual de SQL.

Exemplo:

```java
userRepository.findByEmail(request.getEmail())
```

Essa abordagem reduz significativamente o risco de:

* SQL Injection;
* Query Manipulation;
* execução arbitrária de comandos SQL.

---

## 1.3 Proteção contra XSS e entradas maliciosas

A API opera exclusivamente com payloads JSON tipados e validados.

Além disso:

* os campos possuem limite de tamanho;
* os DTOs restringem formatos esperados;
* não existe renderização direta de HTML;
* o backend não retorna conteúdo executável.

Essas medidas reduzem riscos relacionados a:

* Cross-Site Scripting (XSS);
* payload injection;
* manipulação de scripts.

---

## 1.4 Normalização e validação de parâmetros

Os DTOs foram projetados com regras específicas para garantir consistência dos atributos.

Exemplo:

```java
@NotNull(message = "O customerId é obrigatório")
private Long customerId;
```

```java
@Size(max = 100)
private String origin;
```

Isso garante:

* tipagem forte;
* consistência dos dados;
* previsibilidade das integrações;
* padronização da API.

---

## 1.5 Limitação de tamanho e prevenção de payload flooding

Foram configurados limites globais de payload na aplicação:

```properties
spring.servlet.multipart.max-request-size=2MB
spring.servlet.multipart.max-file-size=2MB
server.tomcat.max-http-form-post-size=2097152
```

Essas restrições mitigam:

* payload flooding;
* upload abusivo;
* consumo excessivo de memória;
* ataques de negação de serviço.

---

## 1.6 Tratamento seguro de erros

A aplicação implementa um `GlobalExceptionHandler` centralizado.

Exemplo:

```java
@ExceptionHandler(Exception.class)
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
```

As respostas:

* não expõem stack trace;
* não revelam estrutura interna;
* não informam tecnologias utilizadas;
* retornam mensagens genéricas controladas.

Exemplo de retorno seguro:

```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "Erro interno no servidor"
}
```

---

# 2. Autenticação e Autorização

## 2.1 Autenticação segura com JWT

A autenticação da plataforma foi implementada utilizando JSON Web Tokens (JWT).

Bibliotecas utilizadas:

* Spring Security;
* JJWT 0.12.6.

Geração do token:

```java
.signWith(getSigningKey())
.expiration(expirationDate)
```

Os tokens incluem:

* assinatura HMAC segura;
* expiração automática;
* identificação do usuário;
* perfil de acesso;
* dealershipId.

---

## 2.2 Expiração e validade dos tokens

Os tokens possuem expiração controlada:

```java
private static final long EXPIRATION = 1000 * 60 * 60 * 2;
```

Tempo configurado:

* 2 horas.

A API valida:

```java
expiration.after(new Date())
```

Isso reduz riscos de:

* sequestro de sessão;
* reutilização de tokens;
* autenticações persistentes indevidas.

---

## 2.3 Controle de acesso baseado em papéis (RBAC)

O sistema implementa RBAC com múltiplos perfis:

* ADMIN
* ANALYST
* DEALER_MANAGER

Exemplo de autorização:

```java
.requestMatchers("/insights/**")
.hasAnyRole("ADMIN", "ANALYST")
```

```java
.requestMatchers("/privacy/**")
.hasRole("ADMIN")
```

As permissões foram segmentadas conforme responsabilidade operacional.

---

## 2.4 Segmentação de permissões

A plataforma diferencia permissões críticas:

| Perfil              | Permissões                         |
| ------------------- | ---------------------------------- |
| ADMIN               | Controle total da plataforma       |
| ANALYST             | Insights, previsões e análises     |
| DEALER_MANAGER      | Leads e clientes da concessionária |
| Usuário autenticado | Recursos limitados conforme escopo |

Isso reduz:

* escalonamento indevido de privilégios;
* acesso não autorizado;
* exposição operacional.

---

# 3. Proteção de APIs e Serviços

## 3.1 HTTPS/TLS 1.2+

A aplicação foi preparada para operação segura via HTTPS.

Configuração SSL:

```properties
server.ssl.enabled=false
server.ssl.key-store=classpath:fordcare.p12
server.ssl.key-store-type=PKCS12
```

A arquitetura suporta:

* TLS 1.2+;
* criptografia ponta a ponta;
* certificados digitais;
* comunicação segura entre app e API.

A configuração SSL foi mantida desativada no ambiente atual de desenvolvimento por dois motivos principais:

1. facilitar testes locais utilizando Expo, Postman e Swagger sem necessidade de certificados autoassinados;
2. evitar conflitos de handshake SSL em ambientes acadêmicos e redes locais.

Mesmo desativado localmente, o projeto foi estruturado para operação segura em produção utilizando HTTPS obrigatório.

No projeto, o certificado SSL já está previsto na configuração da aplicação. Por isso, para reativar o HTTPS não é necessário recriar toda a configuração: basta habilitar novamente o SSL e retornar a porta segura utilizada anteriormente.

Configuração para execução com HTTPS:

```properties
server.port=8443

server.ssl.enabled=true
server.ssl.key-store=classpath:fordcare.p12
server.ssl.key-store-password=123456
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=fordcare

```

Configuração utilizada para desenvolvimento local sem HTTPS:

```properties
server.ssl.enabled=false
server.port=8080
```

Essa decisão foi tomada apenas para facilitar testes locais com Expo, Postman e Swagger, já que certificados locais podem gerar alertas ou conflitos de conexão em algumas ferramentas. Em produção, a configuração recomendada é manter `server.ssl.enabled=true` e utilizar a porta segura `8443` ou HTTPS por proxy/reverse proxy.

Com essa configuração, toda comunicação entre:

* aplicação mobile;
* API REST;
* serviços externos;
* autenticação JWT;

passa a operar criptografada via HTTPS/TLS.

Em ambiente produtivo, a aplicação opera atrás de HTTPS obrigatório.

---

## 3.2 Criptografia entre serviços

As autenticações utilizam:

* JWT assinado;
* credenciais criptografadas;
* transporte seguro HTTPS.

As senhas dos usuários são protegidas com BCrypt:

```java
passwordEncoder.matches(request.getPassword(), user.getPassword())
```

Isso impede armazenamento de senha em texto puro.

---

## 3.3 Rate Limiting e Throttling

Foi implementado controle de requisições utilizando Bucket4j.

Configuração:

```java
Bandwidth.classic(
    20,
    Refill.greedy(20, Duration.ofMinutes(1))
)
```

Limite atual:

* 20 requisições por minuto por IP.

A proteção mitiga:

* brute force;
* scraping;
* DoS;
* abuso de API.

Resposta padronizada:

```json
{
  "status": 429,
  "error": "Too Many Requests"
}
```

---

## 3.4 Configuração segura de CORS

A aplicação restringe origens autorizadas.

Exemplo:

```java
.allowedOrigins(
    "http://localhost:8081",
    "http://localhost:19006"
)
```

Além disso:

* métodos HTTP são limitados;
* credenciais são controladas;
* domínios não autorizados são bloqueados.

---

## 3.5 Integridade de payloads

A integridade das requisições é garantida por:

* HTTPS/TLS;
* assinatura JWT;
* validação de claims;
* controle de autenticação stateless.

Os tokens assinados impedem adulteração dos dados de autenticação durante o tráfego.

---

# 4. Segurança de Dados e Privacidade

## 4.1 Proteção de dados sensíveis

Os dados críticos da aplicação incluem:

* clientes;
* leads;
* histórico de manutenção;
* insights analíticos;
* previsões de IA.

As proteções implementadas incluem:

* autenticação obrigatória;
* segregação por perfil;
* criptografia de senha;
* restrição de endpoints.

---

## 4.2 Anonimização de dados pessoais

A plataforma implementa endpoint específico para anonimização de clientes.

Endpoint:

```http
PUT /privacy/customers/{id}/anonymize
```

Essa funcionalidade atende princípios de:

* LGPD;
* minimização de dados;
* privacidade por design.

Os dados anonimizados podem continuar sendo utilizados em:

* dashboards;
* analytics;
* modelos preditivos.

Sem exposição da identidade real do cliente.

---

## 4.3 Política de retenção e descarte seguro

O projeto foi estruturado para permitir:

* anonimização de registros antigos;
* descarte lógico seguro;
* rastreabilidade operacional.

A arquitetura suporta políticas futuras de:

* retenção automática;
* expurgo programado;
* compliance LGPD.

---

## 4.4 Proteção contra exposição acidental

A aplicação evita exposição indevida por meio de:

* controle de endpoints;
* ausência de stack trace;
* logs sem dados sensíveis;
* autenticação obrigatória;
* segregação RBAC.

Além disso:

* endpoints administrativos possuem proteção dedicada;
* recursos internos não documentados não são expostos publicamente.

---

# 5. Monitoramento, Logs e Auditoria

## 5.1 Logs estruturados e seguros

A aplicação utiliza SLF4J para logging corporativo.

Exemplo:

```java
logger.warn("Tentativa de login inválida para o e-mail: {}", request.getEmail());
```

Os logs:

* não armazenam senhas;
* evitam dados sensíveis;
* mantêm rastreabilidade;
* registram eventos críticos.

---

## 5.2 Monitoramento de eventos suspeitos

A plataforma monitora:

* tentativas inválidas de login;
* acessos negados;
* excesso de requisições;
* falhas de autenticação.

Exemplo:

```java
logger.warn("Tentativa de login inválida")
```

Eventos suspeitos podem ser integrados futuramente com:

* SIEM;
* dashboards de segurança;
* alertas operacionais.

---

## 5.3 Auditoria de ações críticas

Foi implementada trilha de auditoria persistente.

Exemplo:

```java
auditService.register(
    "LOGIN_SUCCESS",
    user.getEmail(),
    "/auth/login",
    httpRequest.getRemoteAddr()
);
```

A auditoria registra:

* ação executada;
* usuário;
* endpoint;
* IP de origem.

Eventos auditáveis incluem:

* autenticação;
* anonimização de dados;
* alterações críticas;
* operações administrativas.

---

# Arquitetura de Segurança

## Camadas implementadas

A solução foi estruturada em múltiplas camadas de defesa:

1. Validação de entrada;
2. Autenticação JWT;
3. Controle RBAC;
4. Rate Limiting;
5. CORS Restritivo;
6. Tratamento seguro de erros;
7. Auditoria persistente;
8. Proteção de dados pessoais;
9. Criptografia de credenciais;
10. Segregação de responsabilidades.

---

# Conclusão

O projeto FordCare Intelligence foi desenvolvido seguindo princípios modernos de segurança de aplicações corporativas.

A arquitetura implementa controles de:

* autenticação;
* autorização;
* validação;
* proteção de APIs;
* rastreabilidade;
* privacidade;
* mitigação de ataques.

As decisões técnicas adotadas permitem que a plataforma opere com:

* escalabilidade;
* rastreabilidade;
* conformidade;
* segurança operacional;
* preparação para ambientes produtivos.

A solução atende aos requisitos definidos na Sprint de Cybersecurity com foco em boas práticas reais de mercado e arquitetura segura para aplicações modernas.
