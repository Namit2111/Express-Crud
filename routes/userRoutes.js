const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

// Protect all routes below this middleware
router.use(protect);

router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('role', 'Role must be either user or admin').isIn(['user', 'admin']),
  ],
  createUser
);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put(
  '/:id',
  [
    check('name').optional().notEmpty(),
    check('email').optional().isEmail(),
    check('role').optional().isIn(['user', 'admin']),
  ],
  updateUser
);

// Only admin can delete users
router.delete('/:id', admin, deleteUser);

module.exports = router;
