import authService from '../../services/concrete/authService';

export const register = async (ctx: any) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      companyCode,
      roleName,
      permissionGroups,
      permissions,
    } = ctx.body;

    console.log('Request User in Register:', ctx.request.user);
    const createdByAdmin = ctx.request.user?.roles.includes('admin');
    if (!createdByAdmin) {
      return { status: 403, message: 'Yalnızca adminler kullanıcı oluşturabilir.' };
    }

    const user = await authService.registerUser(
      { username, email, password, firstName, lastName, phone, address, companyCode, roleName, 
        permissionGroups, permissions },
      createdByAdmin
    );

    return { status: 201, message: 'Kayıt başarılı!', user };
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
};

export const login = async (ctx: any) => {
  try {
    const { email, password } = ctx.body;

    const { token, user } = await authService.loginUser({ email, password });
    return { status: 200, message: 'Giriş başarılı!', token, user };
  } catch (error: any) {
    return { status: 400, message: error.message };
  }
};
