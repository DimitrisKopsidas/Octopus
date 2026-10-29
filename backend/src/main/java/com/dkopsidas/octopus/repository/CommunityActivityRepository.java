package com.dkopsidas.octopus.repository;

import com.dkopsidas.octopus.domain.entity.CommunityActivity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommunityActivityRepository extends JpaRepository<CommunityActivity, UUID> {

    @Query("SELECT ca FROM CommunityActivity ca JOIN FETCH ca.user u WHERE u.active = true ORDER BY ca.createdAt DESC")
    List<CommunityActivity> findRecentActivities(Pageable pageable);
}
