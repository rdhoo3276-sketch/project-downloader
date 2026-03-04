const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) return res.status(400).send('Link mana?');

    try {
        if (videoURL.includes('youtube.com') || videoURL.includes('youtu.be')) {
            res.header('Content-Disposition', 'attachment; filename="youtube_video.mp4"');
            ytdl(videoURL, { format: 'mp4' }).pipe(res);
        } 
        else if (videoURL.includes('tiktok.com')) {
            // Ambil data dari API TikWM
            const response = await axios.get(`https://www.tikwm.com/api/?url=${videoURL}`);
            const videoData = response.data.data;
            const downloadUrl = videoData.play; // Link video tanpa WM

            // Tarik file videonya lalu kirim ke browser sebagai attachment
            const videoStream = await axios({
                method: 'get',
                url: downloadUrl,
                responseType: 'stream'
            });

            res.header('Content-Disposition', 'attachment; filename="tiktok_video.mp4"');
            videoStream.data.pipe(res);
        }
    } catch (err) {
        res.status(500).send('Gagal download: ' + err.message);
    }
});

const PORT = process.env.PORT || 3000; // Render bakal kasih port otomatis

app.listen(PORT, () => {
    console.log(`🚀 Server nyala di port ${PORT}`);
});