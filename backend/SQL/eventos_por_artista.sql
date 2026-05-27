-- Vista que muestra la cantidad de eventos tiene cada artista
CREATE OR REPLACE VIEW eventos_por_artista AS

SELECT
    a.artist_id,
    a.artist_name,
    a.country,

    -- COUNT: cuenta todos los eventos del artista 
    COUNT(e.event_id)                                      AS total_eventos,

    -- COUNT condicional con CASE WHEN: cuenta solo los eventos de tipo concierto
    COUNT(CASE WHEN e.event_type = 'concert'  THEN 1 END) AS conciertos,

    -- Lo mismo para festivales
    COUNT(CASE WHEN e.event_type = 'festival' THEN 1 END) AS festivales,

    -- Lo mismo para tours
    COUNT(CASE WHEN e.event_type = 'tour'     THEN 1 END) AS tours,

    -- MIN y MAX: fecha del primer y ultimo evento del artista
    MIN(e.event_date) AS primer_evento,
    MAX(e.event_date) AS ultimo_evento

FROM artists a

    -- LEFT JOIN: mantiene todos los artistas aunque no tengan eventos
    -- Con INNER JOIN, los artistas sin eventos desaparecen
    LEFT JOIN events e ON a.artist_id = e.artist_id

-- GROUP BY: npara agrupar por artista
GROUP BY a.artist_id, a.artist_name, a.country

-- Los artistas con mas eventos primero
ORDER BY total_eventos DESC;