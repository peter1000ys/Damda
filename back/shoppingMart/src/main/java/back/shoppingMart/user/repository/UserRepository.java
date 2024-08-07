package back.shoppingMart.user.repository;


import back.shoppingMart.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    public User findByNickname(String nickname);

    public User findByEmail(String email);

    boolean existsByEmail(String email);
}
