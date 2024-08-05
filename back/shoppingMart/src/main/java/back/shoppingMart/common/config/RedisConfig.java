package back.shoppingMart.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableRedisRepositories // redis 활성화
public class RedisConfig {
    @Value("${spring.redis.host}")
    private String redisHost;

    @Value("${spring.redis.port}")
    private int redisPort;

    @Value("${spring.redis.password}")
    private String redisPassword;

    /*
    RedisTemplate을 이용한 방식

    RedisConnectionFactory 인터페이스를 통해
    LettuceConnectionFactory를 생성하여 반환
     */

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        final RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(redisHost);
        redisStandaloneConfiguration.setPort(redisPort);
        redisStandaloneConfiguration.setPassword(redisPassword);
        return new LettuceConnectionFactory(redisStandaloneConfiguration);
    }
    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
            // redisTemplate를 받아와서 set, get, delete를 사용
            RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
            /**
             * setKeySerializer, setValueSerializer 설정
             * redis-cli을 통해 직접 데이터를 조회 시 알아볼 수 없는 형태로 출력되는 것을 방지
             */
            redisTemplate.setKeySerializer(new StringRedisSerializer());
            redisTemplate.setValueSerializer(new StringRedisSerializer());
            redisTemplate.setConnectionFactory(redisConnectionFactory());

            return redisTemplate;
    }
}
