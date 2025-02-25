import { Resend } from "resend";
import logger from "../../utils/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  async sendSuspiciousActivityEmail(
    to: string,
    activityDetails: {
      location?: string;
      device?: string;
      browser?: string;
      time: string;
      ip?: string;
    }
  ) {
    try {
      const { data, error } = await resend.emails.send({
        from: "noreply@novent.com.tr",
        to,
        subject: "Şüpheli Oturum Aktivitesi Tespit Edildi",
        html: `
          <h2>Hesabınızda şüpheli bir aktivite tespit edildi</h2>
          <p>Aşağıdaki detaylarla bir oturum açma girişimi gerçekleşti:</p>
          <ul>
            <li>Lokasyon: ${activityDetails.location || "Bilinmiyor"}</li>
            <li>Cihaz: ${activityDetails.device || "Bilinmiyor"}</li>
            <li>Tarayıcı: ${activityDetails.browser || "Bilinmiyor"}</li>
            <li>Zaman: ${activityDetails.time}</li>
            <li>IP Adresi: ${activityDetails.ip || "Bilinmiyor"}</li>
          </ul>
          <p>Bu giriş sizin tarafınızdan yapılmadıysa, lütfen hemen şifrenizi değiştirin ve güvenlik ekibimizle iletişime geçin.</p>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      logger.info("Şüpheli aktivite e-postası gönderildi", { to, data });
      return true;
    } catch (error) {
      logger.error("E-posta gönderimi başarısız", error);
      return false;
    }
  }

  async sendAccountLockedEmail(
    to: string,
    details: {
      remainingMinutes: number;
      failedAttempts: number;
      lastAttemptTime: string;
      ip?: string;
    }
  ) {
    try {
      const { data, error } = await resend.emails.send({
        from: "noreply@novent.com.tr",
        to,
        subject: "Hesabınız Kilitlendi",
        html: `
          <h2>Hesabınız güvenlik nedeniyle kilitlendi</h2>
          <p>Çok sayıda başarısız giriş denemesi nedeniyle hesabınız geçici olarak kilitlendi.</p>
          <ul>
            <li>Başarısız Deneme Sayısı: ${details.failedAttempts}</li>
            <li>Son Deneme Zamanı: ${details.lastAttemptTime}</li>
            <li>IP Adresi: ${details.ip || "Bilinmiyor"}</li>
            <li>Kalan Süre: ${details.remainingMinutes} dakika</li>
          </ul>
          <p>Bu girişimler sizin tarafınızdan yapılmadıysa, lütfen güvenlik ekibimizle iletişime geçin.</p>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      logger.info("Hesap kilitleme e-postası gönderildi", { to, data });
      return true;
    } catch (error) {
      logger.error("E-posta gönderimi başarısız", error);
      return false;
    }
  }

  async sendNewDeviceLoginEmail(
    to: string,
    details: {
      device?: string;
      browser?: string;
      location?: string;
      time: string;
      ip?: string;
    }
  ) {
    try {
      const { data, error } = await resend.emails.send({
        from: "noreply@novent.com.tr",
        to,
        subject: "Yeni Cihazdan Giriş",
        html: `
          <h2>Hesabınıza yeni bir cihazdan giriş yapıldı</h2>
          <p>Aşağıdaki detaylarla yeni bir cihazdan giriş yapıldı:</p>
          <ul>
            <li>Cihaz: ${details.device || "Bilinmiyor"}</li>
            <li>Tarayıcı: ${details.browser || "Bilinmiyor"}</li>
            <li>Lokasyon: ${details.location || "Bilinmiyor"}</li>
            <li>Zaman: ${details.time}</li>
            <li>IP Adresi: ${details.ip || "Bilinmiyor"}</li>
          </ul>
          <p>Bu giriş sizin tarafınızdan yapılmadıysa, lütfen hemen şifrenizi değiştirin ve güvenlik ekibimizle iletişime geçin.</p>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      logger.info("Yeni cihaz giriş e-postası gönderildi", { to, data });
      return true;
    } catch (error) {
      logger.error("E-posta gönderimi başarısız", error);
      return false;
    }
  }

  async sendPasswordChangeEmail(
    to: string,
    details: {
      time: string;
    }
  ) {
    try {
      const { data, error } = await resend.emails.send({
        from: "noreply@novent.com.tr",
        to,
        subject: "Şifreniz Değiştirildi",
        html: `
          <h2>Hesap şifreniz değiştirildi</h2>
          <p>Hesabınızın şifresi ${details.time} tarihinde değiştirildi.</p>
          <p>Eğer bu değişikliği siz yapmadıysanız, lütfen hemen güvenlik ekibimizle iletişime geçin.</p>
          <p>Güvenliğiniz için tüm aktif oturumlarınız sonlandırılmıştır. Lütfen yeni şifrenizle tekrar giriş yapın.</p>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      logger.info("Şifre değişikliği e-postası gönderildi", { to, data });
      return true;
    } catch (error) {
      logger.error("E-posta gönderimi başarısız", error);
      return false;
    }
  }

  async sendPasswordChangeByAdminEmail(
    to: string,
    details: {
      time: string;
      adminUsername: string;
    }
  ) {
    try {
      const { data, error } = await resend.emails.send({
        from: "noreply@novent.com.tr",
        to,
        subject: "Şifreniz Admin Tarafından Değiştirildi",
        html: `
          <h2>Hesap şifreniz admin tarafından değiştirildi</h2>
          <p>Hesabınızın şifresi ${details.time} tarihinde ${details.adminUsername} tarafından değiştirildi.</p>
          <p>Güvenliğiniz için tüm aktif oturumlarınız sonlandırılmıştır. Lütfen yeni şifrenizle tekrar giriş yapın.</p>
          <p>Eğer bu konuda bir sorunuz varsa, lütfen sistem yöneticinizle iletişime geçin.</p>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      logger.info("Admin şifre değişikliği e-postası gönderildi", { to, data });
      return true;
    } catch (error) {
      logger.error("E-posta gönderimi başarısız", error);
      return false;
    }
  }
}

export default new EmailService();
