import { register, login, logout } from '../services/auth.js'; 

export const registerUser = async (req, res) => {
  const session = await register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: session,
  });
};

export const loginUser = async (req, res) => {
  // ВИПРАВЛЕНО: Використовуємо login замість loginUser
  const session = await login(req.body); 

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: session,
  });
};

export const logoutUser = async (req, res) => {
    if (req.session) {
        await logout(req.session._id);
    }
    
    res.status(204).send();
};
