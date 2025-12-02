exports.addUserData = (req, res, next) => {
  const user = req.user;
  if (user) {
    req.userData = {
      id: user.id,
      nama: user.nama,
      role: user.role,
    };
    console.log('Middleware: Data pengguna ditambahkan ke request.', req.userData);
  }
  
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('Middleware: Izin admin diberikan.');
    next();
  } else {
    console.log('Middleware: Gagal! Pengguna bukan admin.');
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin' });
  }
};
