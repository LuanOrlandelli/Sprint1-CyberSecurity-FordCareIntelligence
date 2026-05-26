package fordcare_api;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePassword {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String encrypted = encoder.encode("123456");

        System.out.println(encrypted);
    }
}