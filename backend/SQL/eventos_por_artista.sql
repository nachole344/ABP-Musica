CREATE OR REPLACE VIEW eventos_por_artista AS
SELECT
    a.artist_id,
    a.artist_name,
    a.country,
    COUNT(e.event_id)                                      AS total_eventos,
    COUNT(CASE WHEN e.event_type = 'concert'  THEN 1 END) AS conciertos,
    COUNT(CASE WHEN e.event_type = 'festival' THEN 1 END) AS festivales,
    COUNT(CASE WHEN e.event_type = 'tour'     THEN 1 END) AS tours,
    COUNT(CASE WHEN e.event_type = 'movie'     THEN 1 END) AS movies,
    COUNT(CASE WHEN e.event_type = 'tv_series'     THEN 1 END) AS tv_serie,
    MIN(e.event_date)                                      AS primer_evento,
    MAX(e.event_date)                                      AS ultimo_evento
FROM artists a
LEFT JOIN events e ON a.artist_id = e.artist_id
GROUP BY a.artist_id, a.artist_name, a.country
ORDER BY total_eventos DESC;