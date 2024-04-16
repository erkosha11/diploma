import s from "./LoginSignup.module.scss";

import { observer } from "mobx-react-lite";
import { modalStore } from "../../store/modal-store";
import { Login } from "../../components/FormRegist/Login/Login";
import { Signup } from "../../components/FormRegist/Signup/Signup";
import { Button } from "../../shared/ui/Button/Button";

import { AnimatedBox } from "../../components/AnimatedBox/AnimatedBox";

export const LoginSignUp = observer(() => {
  const toggleOverlay = () => {
    modalStore.toggleLoginSignup();
  };

  return (
    <div
      className={s.container}
      style={{ display: modalStore.isVisible ? "block" : "block" }}
    >
      <AnimatedBox>
        <div className="container">
          <div className={s.content}>
            <div className={s.loginSection}>
              <Login />
            </div>
            <div className={s.signupSection}>
              <Signup />
            </div>
            <div
              className={s.overlay}
              style={{
                transform: modalStore.showLogin
                  ? "translateX(100%)"
                  : "translateX(0)",
              }}
            >
              <div
                className={s.overlayLeft}
                style={{ left: modalStore.showLogin ? "25%" : "25%" }}
              >
                <div
                  className={s.overlayRight}
                  style={{ left: "0" }}
                ></div>
                {modalStore.showLogin ? (
                  <div className={s.buttons}>
                    <p>Welcome Back!</p>
                    <Button onClick={toggleOverlay}>Sign Up</Button>
                  </div>
                ) : (
                  <div className={s.buttons}>
                    <p>Hello Friend!</p>
                    <Button onClick={toggleOverlay}>Login</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedBox>
    </div>
  );
});