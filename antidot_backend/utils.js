import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    // process.env.JWT_SECRET_KEY || 'somethingsecret',
    `${process.env.JWT_SECRET || "somethingsecret"}`,
    {
      expiresIn: "1000d",
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    console.log(authorization);
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    console.log("token");
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ err });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};

// export const isSeller = (req, res, next) => {
//   if(req.user && req.user.isSeller) {
//     next();
//   } else {
//     next();
// //     res.status(401).send({ message: 'Invalid Seller Token' });
//   }
// };
