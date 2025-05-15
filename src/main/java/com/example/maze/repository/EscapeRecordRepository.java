package com.example.maze.repository;

import com.example.maze.domain.EscapeRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EscapeRecordRepository extends JpaRepository<EscapeRecord, Long> {

    @Query(value = """
        SELECT r.user.username AS username, MIN(r.elapsedTime) AS bestTime, r.moveCount AS moveCount
        FROM EscapeRecord r
        GROUP BY r.user.username, r.moveCount
        ORDER BY bestTime ASC
        """)
    List<Object[]> findTopRankings();

    @Query(value = """
        SELECT COUNT(DISTINCT r2.user.id) + 1
        FROM EscapeRecord r2
        WHERE r2.user.username <> :username
        AND EXISTS (
            SELECT 1 FROM EscapeRecord r3
            WHERE r3.user.username = r2.user.username
            GROUP BY r3.user.username
            HAVING MIN(r3.elapsedTime) < (
                SELECT MIN(r4.elapsedTime) FROM EscapeRecord r4 WHERE r4.user.username = :username
            )
        )
        """)
    int findUserRank(@Param("username") String username);

    @Query(value = """
        SELECT r FROM EscapeRecord r
        WHERE r.user.username = :username
        ORDER BY r.elapsedTime ASC
        """)
    List<EscapeRecord> findUserRecordsOrderByElapsedTime(@Param("username") String username);
}
