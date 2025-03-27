const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Assure-toi que le chemin est correct

// GET - Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// GET - Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// POST - Ajouter un nouveau produit
router.post('/', async (req, res) => {
  try {
    const { ref, category, level } = req.body;
    
    // Vérifier si le produit existe déjà
    const existingProduct = await Product.findOne({ ref });
    if (existingProduct) return res.status(400).json({ message: 'Ce produit existe déjà' });

    const newProduct = new Product({ ref, category, level });
    await newProduct.save();
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// PUT - Mettre à jour un produit
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Produit non trouvé' });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// DELETE - Supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Produit non trouvé' });

    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// Route to check product references
router.post("/check", async (req, res) => {
  try {
    const { references } = req.body;

    // Find products matching the references
    const products = await Product.find({ ref: { $in: references } });

    // Map results to match the input order
    const result = references.map((ref) => {
      const product = products.find((p) => p.ref === ref);
      return product ? product : { ref, category: null, level: null };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
