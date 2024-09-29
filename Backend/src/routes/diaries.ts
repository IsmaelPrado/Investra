import express from "express";

const router = express.Router();

router.get('/', (_, res) => {
    res.send('Fetching all entry daries...');
})

router.post('/', (_, res) => {
    res.send('Saving a daries...');
});

export default router;