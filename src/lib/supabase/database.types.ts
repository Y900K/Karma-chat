/* Generated from the live PostgREST OpenAPI catalog. Do not edit manually. */
export type Json=string|number|boolean|null|{[key:string]:Json|undefined}|Json[];
export type Database={public:{Tables:{
      "abuse_signals": {
        Row: {
          "id": number
          "subject_type": string
          "subject_hash": string
          "action": string
          "signal_type": string
          "metadata": Json
          "created_at": string
        }
        Insert: {
          "id"?: number
          "subject_type": string
          "subject_hash": string
          "action": string
          "signal_type": string
          "metadata": Json
          "created_at"?: string
        }
        Update: {
          "id"?: number
          "subject_type"?: string
          "subject_hash"?: string
          "action"?: string
          "signal_type"?: string
          "metadata"?: Json
          "created_at"?: string
        }
        Relationships: []
      }
      "aggregate_metric_snapshots": {
        Row: {
          "id": string
          "program_organization_id": string
          "geography_level": string
          "geography_code": string
          "metric_key": string
          "metric_value": number
          "cohort_size": number
          "period_start": string
          "period_end": string
          "dimensions": Json
          "suppressed": boolean | null
        }
        Insert: {
          "id"?: string
          "program_organization_id": string
          "geography_level": string
          "geography_code": string
          "metric_key": string
          "metric_value": number
          "cohort_size": number
          "period_start": string
          "period_end": string
          "dimensions": Json
          "suppressed"?: boolean | null
        }
        Update: {
          "id"?: string
          "program_organization_id"?: string
          "geography_level"?: string
          "geography_code"?: string
          "metric_key"?: string
          "metric_value"?: number
          "cohort_size"?: number
          "period_start"?: string
          "period_end"?: string
          "dimensions"?: Json
          "suppressed"?: boolean | null
        }
        Relationships: []
      }
      "ai_request_audits": {
        Row: {
          "id": number
          "user_id": string | null
          "prompt_key": string
          "prompt_version": string
          "model_key": string
          "request_id": string
          "input_tokens": number | null
          "output_tokens": number | null
          "latency_ms": number | null
          "status": string
          "safety_flags": Array<string>
          "created_at": string
        }
        Insert: {
          "id"?: number
          "user_id"?: string | null
          "prompt_key": string
          "prompt_version": string
          "model_key": string
          "request_id": string
          "input_tokens"?: number | null
          "output_tokens"?: number | null
          "latency_ms"?: number | null
          "status": string
          "safety_flags": Array<string>
          "created_at"?: string
        }
        Update: {
          "id"?: number
          "user_id"?: string | null
          "prompt_key"?: string
          "prompt_version"?: string
          "model_key"?: string
          "request_id"?: string
          "input_tokens"?: number | null
          "output_tokens"?: number | null
          "latency_ms"?: number | null
          "status"?: string
          "safety_flags"?: Array<string>
          "created_at"?: string
        }
        Relationships: []
      }
      "ai_usage_windows": {
        Row: {
          "user_id": string
          "task": string
          "window_started_at": string
          "request_count": number
          "token_count": number
        }
        Insert: {
          "user_id": string
          "task": string
          "window_started_at": string
          "request_count"?: number
          "token_count"?: number
        }
        Update: {
          "user_id"?: string
          "task"?: string
          "window_started_at"?: string
          "request_count"?: number
          "token_count"?: number
        }
        Relationships: []
      }
      "analytics_events": {
        Row: {
          "id": number
          "user_id": string | null
          "anonymous_id_hash": string | null
          "event_name": string
          "path": string | null
          "properties": Json
          "occurred_at": string
          "received_at": string
        }
        Insert: {
          "id"?: number
          "user_id"?: string | null
          "anonymous_id_hash"?: string | null
          "event_name": string
          "path"?: string | null
          "properties": Json
          "occurred_at": string
          "received_at"?: string
        }
        Update: {
          "id"?: number
          "user_id"?: string | null
          "anonymous_id_hash"?: string | null
          "event_name"?: string
          "path"?: string | null
          "properties"?: Json
          "occurred_at"?: string
          "received_at"?: string
        }
        Relationships: []
      }
      "analytics_events_archive": {
        Row: {
          "id": number
          "user_id": string | null
          "anonymous_id_hash": string | null
          "event_name": string
          "path": string | null
          "properties": Json
          "occurred_at": string
          "received_at": string
        }
        Insert: {
          "id"?: number
          "user_id"?: string | null
          "anonymous_id_hash"?: string | null
          "event_name": string
          "path"?: string | null
          "properties": Json
          "occurred_at": string
          "received_at"?: string
        }
        Update: {
          "id"?: number
          "user_id"?: string | null
          "anonymous_id_hash"?: string | null
          "event_name"?: string
          "path"?: string | null
          "properties"?: Json
          "occurred_at"?: string
          "received_at"?: string
        }
        Relationships: []
      }
      "application_decisions": {
        Row: {
          "id": string
          "application_id": string
          "decision": string
          "reason_code": string
          "evidence_note": string | null
          "decided_by": string
          "decided_at": string
        }
        Insert: {
          "id"?: string
          "application_id": string
          "decision": string
          "reason_code": string
          "evidence_note"?: string | null
          "decided_by": string
          "decided_at"?: string
        }
        Update: {
          "id"?: string
          "application_id"?: string
          "decision"?: string
          "reason_code"?: string
          "evidence_note"?: string | null
          "decided_by"?: string
          "decided_at"?: string
        }
        Relationships: []
      }
      "application_events": {
        Row: {
          "id": string
          "application_id": string
          "event_type": string
          "actor_user_id": string | null
          "detail": Json
          "created_at": string
        }
        Insert: {
          "id"?: string
          "application_id": string
          "event_type": string
          "actor_user_id"?: string | null
          "detail": Json
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "application_id"?: string
          "event_type"?: string
          "actor_user_id"?: string | null
          "detail"?: Json
          "created_at"?: string
        }
        Relationships: []
      }
      "applications": {
        Row: {
          "id": string
          "user_id": string
          "job_id": string
          "status": string
          "profile_share_consent": boolean
          "shared_snapshot": Json
          "submitted_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "job_id": string
          "status": string
          "profile_share_consent": boolean
          "shared_snapshot": Json
          "submitted_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "job_id"?: string
          "status"?: string
          "profile_share_consent"?: boolean
          "shared_snapshot"?: Json
          "submitted_at"?: string
          "updated_at"?: string
        }
        Relationships: []
      }
      "assessment_attempts": {
        Row: {
          "id": string
          "user_id": string
          "assessment_slug": string
          "assessment_version": string
          "status": string
          "score": number | null
          "started_at": string
          "completed_at": string | null
        }
        Insert: {
          "id"?: string
          "user_id": string
          "assessment_slug": string
          "assessment_version": string
          "status": string
          "score"?: number | null
          "started_at"?: string
          "completed_at"?: string | null
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "assessment_slug"?: string
          "assessment_version"?: string
          "status"?: string
          "score"?: number | null
          "started_at"?: string
          "completed_at"?: string | null
        }
        Relationships: []
      }
      "assessment_definitions": {
        Row: {
          "slug": string
          "version": string
          "target_role_slug": string
          "title": Json
          "blueprint": Json
          "status": string
          "published_at": string | null
        }
        Insert: {
          "slug": string
          "version": string
          "target_role_slug": string
          "title": Json
          "blueprint": Json
          "status": string
          "published_at"?: string | null
        }
        Update: {
          "slug"?: string
          "version"?: string
          "target_role_slug"?: string
          "title"?: Json
          "blueprint"?: Json
          "status"?: string
          "published_at"?: string | null
        }
        Relationships: []
      }
      "assessment_questions": {
        Row: {
          "id": string
          "version": string
          "assessment_slug": string
          "assessment_version": string
          "dimension": string
          "prompt": Json
          "options": Json
          "correct_option": number
          "rationale": Json
          "difficulty": number
          "status": string
        }
        Insert: {
          "id"?: string
          "version": string
          "assessment_slug": string
          "assessment_version": string
          "dimension": string
          "prompt": Json
          "options": Json
          "correct_option": number
          "rationale": Json
          "difficulty": number
          "status": string
        }
        Update: {
          "id"?: string
          "version"?: string
          "assessment_slug"?: string
          "assessment_version"?: string
          "dimension"?: string
          "prompt"?: Json
          "options"?: Json
          "correct_option"?: number
          "rationale"?: Json
          "difficulty"?: number
          "status"?: string
        }
        Relationships: []
      }
      "assessment_responses": {
        Row: {
          "id": string
          "attempt_id": string
          "question_id": string
          "selected_option": number
          "confidence": number
          "is_correct": boolean
          "answered_at": string
        }
        Insert: {
          "id"?: string
          "attempt_id": string
          "question_id": string
          "selected_option": number
          "confidence": number
          "is_correct": boolean
          "answered_at"?: string
        }
        Update: {
          "id"?: string
          "attempt_id"?: string
          "question_id"?: string
          "selected_option"?: number
          "confidence"?: number
          "is_correct"?: boolean
          "answered_at"?: string
        }
        Relationships: []
      }
      "audit_events": {
        Row: {
          "id": number
          "actor_user_id": string | null
          "organization_id": string | null
          "action": string
          "resource_type": string
          "resource_id": string | null
          "purpose": string | null
          "metadata": Json
          "created_at": string
        }
        Insert: {
          "id"?: number
          "actor_user_id"?: string | null
          "organization_id"?: string | null
          "action": string
          "resource_type": string
          "resource_id"?: string | null
          "purpose"?: string | null
          "metadata": Json
          "created_at"?: string
        }
        Update: {
          "id"?: number
          "actor_user_id"?: string | null
          "organization_id"?: string | null
          "action"?: string
          "resource_type"?: string
          "resource_id"?: string | null
          "purpose"?: string | null
          "metadata"?: Json
          "created_at"?: string
        }
        Relationships: []
      }
      "audit_events_archive": {
        Row: {
          "id": number
          "actor_user_id": string | null
          "organization_id": string | null
          "action": string
          "resource_type": string
          "resource_id": string | null
          "purpose": string | null
          "metadata": Json
          "created_at": string
        }
        Insert: {
          "id"?: number
          "actor_user_id"?: string | null
          "organization_id"?: string | null
          "action": string
          "resource_type": string
          "resource_id"?: string | null
          "purpose"?: string | null
          "metadata": Json
          "created_at"?: string
        }
        Update: {
          "id"?: number
          "actor_user_id"?: string | null
          "organization_id"?: string | null
          "action"?: string
          "resource_type"?: string
          "resource_id"?: string | null
          "purpose"?: string | null
          "metadata"?: Json
          "created_at"?: string
        }
        Relationships: []
      }
      "availability_windows": {
        Row: {
          "id": string
          "user_id": string
          "starts_at": string
          "ends_at": string
          "timezone": string
          "recurrence_rule": string | null
          "visibility": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "starts_at": string
          "ends_at": string
          "timezone"?: string
          "recurrence_rule"?: string | null
          "visibility"?: string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "starts_at"?: string
          "ends_at"?: string
          "timezone"?: string
          "recurrence_rule"?: string | null
          "visibility"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "background_jobs": {
        Row: {
          "id": number
          "job_type": string
          "payload": Json
          "status": string
          "attempt_count": number
          "available_at": string
          "locked_at": string | null
          "last_error": string | null
          "created_at": string
          "completed_at": string | null
          "user_id": string | null
          "organization_id": string | null
          "idempotency_key": string | null
          "result": Json | null
          "locked_by": string | null
          "expires_at": string | null
        }
        Insert: {
          "id"?: number
          "job_type": string
          "payload": Json
          "status"?: string
          "attempt_count"?: number
          "available_at"?: string
          "locked_at"?: string | null
          "last_error"?: string | null
          "created_at"?: string
          "completed_at"?: string | null
          "user_id"?: string | null
          "organization_id"?: string | null
          "idempotency_key"?: string | null
          "result"?: Json | null
          "locked_by"?: string | null
          "expires_at"?: string | null
        }
        Update: {
          "id"?: number
          "job_type"?: string
          "payload"?: Json
          "status"?: string
          "attempt_count"?: number
          "available_at"?: string
          "locked_at"?: string | null
          "last_error"?: string | null
          "created_at"?: string
          "completed_at"?: string | null
          "user_id"?: string | null
          "organization_id"?: string | null
          "idempotency_key"?: string | null
          "result"?: Json | null
          "locked_by"?: string | null
          "expires_at"?: string | null
        }
        Relationships: []
      }
      "cohort_assignments": {
        Row: {
          "id": string
          "cohort_id": string
          "path_version_id": string
          "assigned_by": string
          "due_at": string | null
          "status": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "cohort_id": string
          "path_version_id": string
          "assigned_by": string
          "due_at"?: string | null
          "status"?: string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "cohort_id"?: string
          "path_version_id"?: string
          "assigned_by"?: string
          "due_at"?: string | null
          "status"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "cohort_enrollments": {
        Row: {
          "cohort_id": string
          "learner_user_id": string
          "status": string
          "joined_at": string
        }
        Insert: {
          "cohort_id": string
          "learner_user_id": string
          "status"?: string
          "joined_at"?: string
        }
        Update: {
          "cohort_id"?: string
          "learner_user_id"?: string
          "status"?: string
          "joined_at"?: string
        }
        Relationships: []
      }
      "cohort_latest_metric_snapshots": {
        Row: {
          "id": string | null
          "cohort_id": string | null
          "captured_on": string | null
          "learner_count": number | null
          "readiness_percent": number | null
          "engagement_percent": number | null
          "evidence_percent": number | null
          "application_count": number | null
          "offer_count": number | null
        }
        Insert: {
          "id"?: string | null
          "cohort_id"?: string | null
          "captured_on"?: string | null
          "learner_count"?: number | null
          "readiness_percent"?: number | null
          "engagement_percent"?: number | null
          "evidence_percent"?: number | null
          "application_count"?: number | null
          "offer_count"?: number | null
        }
        Update: {
          "id"?: string | null
          "cohort_id"?: string | null
          "captured_on"?: string | null
          "learner_count"?: number | null
          "readiness_percent"?: number | null
          "engagement_percent"?: number | null
          "evidence_percent"?: number | null
          "application_count"?: number | null
          "offer_count"?: number | null
        }
        Relationships: []
      }
      "cohort_metric_snapshots": {
        Row: {
          "id": string
          "cohort_id": string
          "captured_on": string
          "learner_count": number
          "readiness_percent": number | null
          "engagement_percent": number | null
          "evidence_percent": number | null
          "application_count": number
          "offer_count": number
        }
        Insert: {
          "id"?: string
          "cohort_id": string
          "captured_on": string
          "learner_count"?: number
          "readiness_percent"?: number | null
          "engagement_percent"?: number | null
          "evidence_percent"?: number | null
          "application_count"?: number
          "offer_count"?: number
        }
        Update: {
          "id"?: string
          "cohort_id"?: string
          "captured_on"?: string
          "learner_count"?: number
          "readiness_percent"?: number | null
          "engagement_percent"?: number | null
          "evidence_percent"?: number | null
          "application_count"?: number
          "offer_count"?: number
        }
        Relationships: []
      }
      "cohorts": {
        Row: {
          "id": string
          "organization_id": string
          "name": string
          "trade": string
          "academic_year": string
          "semester": number | null
          "status": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "organization_id": string
          "name": string
          "trade": string
          "academic_year": string
          "semester"?: number | null
          "status"?: string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "organization_id"?: string
          "name"?: string
          "trade"?: string
          "academic_year"?: string
          "semester"?: number | null
          "status"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "communication_opt_ins": {
        Row: {
          "user_id": string
          "channel": string
          "destination_hash": string
          "verified_at": string | null
          "consented_at": string
          "policy_version": string
          "revoked_at": string | null
        }
        Insert: {
          "user_id": string
          "channel": string
          "destination_hash": string
          "verified_at"?: string | null
          "consented_at": string
          "policy_version": string
          "revoked_at"?: string | null
        }
        Update: {
          "user_id"?: string
          "channel"?: string
          "destination_hash"?: string
          "verified_at"?: string | null
          "consented_at"?: string
          "policy_version"?: string
          "revoked_at"?: string | null
        }
        Relationships: []
      }
      "communication_preferences": {
        Row: {
          "user_id": string
          "email_enabled": boolean
          "interview_reminders": boolean
          "weekly_summary": boolean
          "whatsapp_enabled": boolean
          "sms_enabled": boolean
          "quiet_hours_start": string | null
          "quiet_hours_end": string | null
          "timezone": string
          "updated_at": string
        }
        Insert: {
          "user_id": string
          "email_enabled"?: boolean
          "interview_reminders"?: boolean
          "weekly_summary"?: boolean
          "whatsapp_enabled"?: boolean
          "sms_enabled"?: boolean
          "quiet_hours_start"?: string | null
          "quiet_hours_end"?: string | null
          "timezone"?: string
          "updated_at"?: string
        }
        Update: {
          "user_id"?: string
          "email_enabled"?: boolean
          "interview_reminders"?: boolean
          "weekly_summary"?: boolean
          "whatsapp_enabled"?: boolean
          "sms_enabled"?: boolean
          "quiet_hours_start"?: string | null
          "quiet_hours_end"?: string | null
          "timezone"?: string
          "updated_at"?: string
        }
        Relationships: []
      }
      "consent_records": {
        Row: {
          "id": string
          "user_id": string
          "purpose": string
          "granted": boolean
          "policy_version": string
          "captured_at": string
          "withdrawn_at": string | null
        }
        Insert: {
          "id"?: string
          "user_id": string
          "purpose": string
          "granted": boolean
          "policy_version"?: string
          "captured_at"?: string
          "withdrawn_at"?: string | null
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "purpose"?: string
          "granted"?: boolean
          "policy_version"?: string
          "captured_at"?: string
          "withdrawn_at"?: string | null
        }
        Relationships: []
      }
      "content_approvals": {
        Row: {
          "id": string
          "resource_id": string | null
          "path_version_id": string | null
          "gate": string
          "reviewer_id": string
          "decision": string
          "note": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "resource_id"?: string | null
          "path_version_id"?: string | null
          "gate": string
          "reviewer_id": string
          "decision": string
          "note"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "resource_id"?: string | null
          "path_version_id"?: string | null
          "gate"?: string
          "reviewer_id"?: string
          "decision"?: string
          "note"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "content_chunks": {
        Row: {
          "id": string
          "document_id": string
          "position": number
          "content": string
          "search_vector": number[] | null
          "embedding": number[] | null
          "embedding_model": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "document_id": string
          "position": number
          "content": string
          "search_vector"?: number[] | null
          "embedding"?: number[] | null
          "embedding_model"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "document_id"?: string
          "position"?: number
          "content"?: string
          "search_vector"?: number[] | null
          "embedding"?: number[] | null
          "embedding_model"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "content_documents": {
        Row: {
          "id": string
          "title": string
          "locale": string
          "source_type": string
          "source_url": string | null
          "owner_organization_id": string | null
          "status": string
          "reviewed_by": string | null
          "reviewed_at": string | null
          "review_due_at": string | null
          "content_hash": string
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "title": string
          "locale": string
          "source_type": string
          "source_url"?: string | null
          "owner_organization_id"?: string | null
          "status"?: string
          "reviewed_by"?: string | null
          "reviewed_at"?: string | null
          "review_due_at"?: string | null
          "content_hash": string
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "title"?: string
          "locale"?: string
          "source_type"?: string
          "source_url"?: string | null
          "owner_organization_id"?: string | null
          "status"?: string
          "reviewed_by"?: string | null
          "reviewed_at"?: string | null
          "review_due_at"?: string | null
          "content_hash"?: string
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: []
      }
      "content_revisions": {
        Row: {
          "id": string
          "resource_id": string
          "version": number
          "content_en": Json
          "content_hi": Json | null
          "change_note": string
          "created_by": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "resource_id": string
          "version": number
          "content_en": Json
          "content_hi"?: Json | null
          "change_note": string
          "created_by": string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "resource_id"?: string
          "version"?: number
          "content_en"?: Json
          "content_hi"?: Json | null
          "change_note"?: string
          "created_by"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "data_export_requests": {
        Row: {
          "id": string
          "program_organization_id": string
          "requested_by": string
          "purpose": string
          "fields": Array<string>
          "filters": Json
          "status": string
          "approved_by": string | null
          "expires_at": string | null
          "download_count": number
          "created_at": string
        }
        Insert: {
          "id"?: string
          "program_organization_id": string
          "requested_by": string
          "purpose": string
          "fields": Array<string>
          "filters": Json
          "status"?: string
          "approved_by"?: string | null
          "expires_at"?: string | null
          "download_count"?: number
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "program_organization_id"?: string
          "requested_by"?: string
          "purpose"?: string
          "fields"?: Array<string>
          "filters"?: Json
          "status"?: string
          "approved_by"?: string | null
          "expires_at"?: string | null
          "download_count"?: number
          "created_at"?: string
        }
        Relationships: []
      }
      "data_subject_requests": {
        Row: {
          "id": string
          "user_id": string
          "request_type": string
          "detail": string | null
          "status": string
          "due_at": string | null
          "completion_note": string | null
          "created_at": string
          "completed_at": string | null
        }
        Insert: {
          "id"?: string
          "user_id": string
          "request_type": string
          "detail"?: string | null
          "status"?: string
          "due_at"?: string | null
          "completion_note"?: string | null
          "created_at"?: string
          "completed_at"?: string | null
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "request_type"?: string
          "detail"?: string | null
          "status"?: string
          "due_at"?: string | null
          "completion_note"?: string | null
          "created_at"?: string
          "completed_at"?: string | null
        }
        Relationships: []
      }
      "employer_job_rollups": {
        Row: {
          "job_id": string | null
          "organization_id": string | null
          "status": string | null
          "application_count": number | null
          "offer_count": number | null
          "last_activity_at": string | null
        }
        Insert: {
          "job_id"?: string | null
          "organization_id"?: string | null
          "status"?: string | null
          "application_count"?: number | null
          "offer_count"?: number | null
          "last_activity_at"?: string | null
        }
        Update: {
          "job_id"?: string | null
          "organization_id"?: string | null
          "status"?: string | null
          "application_count"?: number | null
          "offer_count"?: number | null
          "last_activity_at"?: string | null
        }
        Relationships: []
      }
      "employer_memberships": {
        Row: {
          "id": string
          "organization_id": string
          "user_id": string
          "role": "owner" | "admin" | "recruiter" | "interviewer" | "viewer"
          "status": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "organization_id": string
          "user_id": string
          "role"?: "owner" | "admin" | "recruiter" | "interviewer" | "viewer"
          "status"?: string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "organization_id"?: string
          "user_id"?: string
          "role"?: "owner" | "admin" | "recruiter" | "interviewer" | "viewer"
          "status"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "employment_outcomes": {
        Row: {
          "id": string
          "application_id": string
          "offered_salary": number | null
          "joining_date": string | null
          "joined": boolean | null
          "retention_30_day": boolean | null
          "retention_90_day": boolean | null
          "learner_confirmed_at": string | null
          "employer_updated_at": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "application_id": string
          "offered_salary"?: number | null
          "joining_date"?: string | null
          "joined"?: boolean | null
          "retention_30_day"?: boolean | null
          "retention_90_day"?: boolean | null
          "learner_confirmed_at"?: string | null
          "employer_updated_at"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "application_id"?: string
          "offered_salary"?: number | null
          "joining_date"?: string | null
          "joined"?: boolean | null
          "retention_30_day"?: boolean | null
          "retention_90_day"?: boolean | null
          "learner_confirmed_at"?: string | null
          "employer_updated_at"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "event_participants": {
        Row: {
          "event_id": string
          "user_id": string
          "role": string
          "response": string
          "responded_at": string | null
        }
        Insert: {
          "event_id": string
          "user_id": string
          "role": string
          "response"?: string
          "responded_at"?: string | null
        }
        Update: {
          "event_id"?: string
          "user_id"?: string
          "role"?: string
          "response"?: string
          "responded_at"?: string | null
        }
        Relationships: []
      }
      "evidence_appeals": {
        Row: {
          "id": string
          "evidence_id": string
          "user_id": string
          "reason": string
          "status": string
          "created_at": string
          "resolved_at": string | null
        }
        Insert: {
          "id"?: string
          "evidence_id": string
          "user_id": string
          "reason": string
          "status"?: string
          "created_at"?: string
          "resolved_at"?: string | null
        }
        Update: {
          "id"?: string
          "evidence_id"?: string
          "user_id"?: string
          "reason"?: string
          "status"?: string
          "created_at"?: string
          "resolved_at"?: string | null
        }
        Relationships: []
      }
      "evidence_reviews": {
        Row: {
          "id": string
          "evidence_id": string
          "reviewer_id": string
          "rubric_slug": string
          "rubric_version": string
          "criterion_scores": Json
          "decision": string
          "feedback": string
          "reviewed_at": string
        }
        Insert: {
          "id"?: string
          "evidence_id": string
          "reviewer_id": string
          "rubric_slug": string
          "rubric_version": string
          "criterion_scores": Json
          "decision": string
          "feedback": string
          "reviewed_at"?: string
        }
        Update: {
          "id"?: string
          "evidence_id"?: string
          "reviewer_id"?: string
          "rubric_slug"?: string
          "rubric_version"?: string
          "criterion_scores"?: Json
          "decision"?: string
          "feedback"?: string
          "reviewed_at"?: string
        }
        Relationships: []
      }
      "evidence_rubrics": {
        Row: {
          "slug": string
          "version": string
          "skill_slug": string
          "title": Json
          "criteria": Json
          "status": string
          "published_at": string | null
        }
        Insert: {
          "slug": string
          "version": string
          "skill_slug": string
          "title": Json
          "criteria": Json
          "status": string
          "published_at"?: string | null
        }
        Update: {
          "slug"?: string
          "version"?: string
          "skill_slug"?: string
          "title"?: Json
          "criteria"?: Json
          "status"?: string
          "published_at"?: string | null
        }
        Relationships: []
      }
      "external_resources": {
        Row: {
          "id": string
          "provider": string
          "external_id": string
          "title_en": string
          "title_hi": string | null
          "language": string
          "owner_name": string
          "owner_contact": string | null
          "embed_url": string
          "privacy_mode": boolean
          "captions_available": boolean
          "text_fallback": string | null
          "permission_status": string
          "review_status": string
          "reviewed_by": string | null
          "reviewed_at": string | null
          "next_review_at": string | null
          "metadata": Json
        }
        Insert: {
          "id"?: string
          "provider": string
          "external_id": string
          "title_en": string
          "title_hi"?: string | null
          "language": string
          "owner_name": string
          "owner_contact"?: string | null
          "embed_url": string
          "privacy_mode"?: boolean
          "captions_available"?: boolean
          "text_fallback"?: string | null
          "permission_status"?: string
          "review_status"?: string
          "reviewed_by"?: string | null
          "reviewed_at"?: string | null
          "next_review_at"?: string | null
          "metadata": Json
        }
        Update: {
          "id"?: string
          "provider"?: string
          "external_id"?: string
          "title_en"?: string
          "title_hi"?: string | null
          "language"?: string
          "owner_name"?: string
          "owner_contact"?: string | null
          "embed_url"?: string
          "privacy_mode"?: boolean
          "captions_available"?: boolean
          "text_fallback"?: string | null
          "permission_status"?: string
          "review_status"?: string
          "reviewed_by"?: string | null
          "reviewed_at"?: string | null
          "next_review_at"?: string | null
          "metadata"?: Json
        }
        Relationships: []
      }
      "feature_flags": {
        Row: {
          "key": string
          "description": string
          "enabled": boolean
          "rollout_percent": number
          "audience": Json
          "risk_tier": string
          "updated_by": string
          "updated_at": string
        }
        Insert: {
          "key": string
          "description": string
          "enabled"?: boolean
          "rollout_percent"?: number
          "audience": Json
          "risk_tier": string
          "updated_by": string
          "updated_at"?: string
        }
        Update: {
          "key"?: string
          "description"?: string
          "enabled"?: boolean
          "rollout_percent"?: number
          "audience"?: Json
          "risk_tier"?: string
          "updated_by"?: string
          "updated_at"?: string
        }
        Relationships: []
      }
      "governance_cases": {
        Row: {
          "id": string
          "program_organization_id": string
          "case_type": "grievance" | "appeal" | "fairness_review" | "security_incident" | "data_request"
          "severity": string
          "status": string
          "subject_ref": string | null
          "summary": string
          "assigned_to": string | null
          "due_at": string | null
          "resolution": string | null
          "created_at": string
          "resolved_at": string | null
        }
        Insert: {
          "id"?: string
          "program_organization_id": string
          "case_type": "grievance" | "appeal" | "fairness_review" | "security_incident" | "data_request"
          "severity": string
          "status"?: string
          "subject_ref"?: string | null
          "summary": string
          "assigned_to"?: string | null
          "due_at"?: string | null
          "resolution"?: string | null
          "created_at"?: string
          "resolved_at"?: string | null
        }
        Update: {
          "id"?: string
          "program_organization_id"?: string
          "case_type"?: "grievance" | "appeal" | "fairness_review" | "security_incident" | "data_request"
          "severity"?: string
          "status"?: string
          "subject_ref"?: string | null
          "summary"?: string
          "assigned_to"?: string | null
          "due_at"?: string | null
          "resolution"?: string | null
          "created_at"?: string
          "resolved_at"?: string | null
        }
        Relationships: []
      }
      "government_metric_rollups": {
        Row: {
          "id": string | null
          "program_organization_id": string | null
          "geography_level": string | null
          "geography_code": string | null
          "metric_key": string | null
          "metric_value": number | null
          "cohort_size": number | null
          "period_start": string | null
          "period_end": string | null
          "dimensions": Json | null
        }
        Insert: {
          "id"?: string | null
          "program_organization_id"?: string | null
          "geography_level"?: string | null
          "geography_code"?: string | null
          "metric_key"?: string | null
          "metric_value"?: number | null
          "cohort_size"?: number | null
          "period_start"?: string | null
          "period_end"?: string | null
          "dimensions"?: Json | null
        }
        Update: {
          "id"?: string | null
          "program_organization_id"?: string | null
          "geography_level"?: string | null
          "geography_code"?: string | null
          "metric_key"?: string | null
          "metric_value"?: number | null
          "cohort_size"?: number | null
          "period_start"?: string | null
          "period_end"?: string | null
          "dimensions"?: Json | null
        }
        Relationships: []
      }
      "hiring_pipeline_entries": {
        Row: {
          "id": string
          "application_id": string
          "stage": string
          "owner_user_id": string | null
          "stage_updated_at": string
        }
        Insert: {
          "id"?: string
          "application_id": string
          "stage": string
          "owner_user_id"?: string | null
          "stage_updated_at"?: string
        }
        Update: {
          "id"?: string
          "application_id"?: string
          "stage"?: string
          "owner_user_id"?: string | null
          "stage_updated_at"?: string
        }
        Relationships: []
      }
      "hiring_team_notes": {
        Row: {
          "id": string
          "application_id": string
          "author_user_id": string
          "body": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "application_id": string
          "author_user_id": string
          "body": string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "application_id"?: string
          "author_user_id"?: string
          "body"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "idempotency_records": {
        Row: {
          "user_id": string
          "operation": string
          "idempotency_key": string
          "response_snapshot": Json | null
          "status": string
          "created_at": string
          "expires_at": string
        }
        Insert: {
          "user_id": string
          "operation": string
          "idempotency_key": string
          "response_snapshot"?: Json | null
          "status": string
          "created_at"?: string
          "expires_at": string
        }
        Update: {
          "user_id"?: string
          "operation"?: string
          "idempotency_key"?: string
          "response_snapshot"?: Json | null
          "status"?: string
          "created_at"?: string
          "expires_at"?: string
        }
        Relationships: []
      }
      "institute_data_grants": {
        Row: {
          "id": string
          "learner_user_id": string
          "organization_id": string
          "purpose": string
          "scopes": Array<string>
          "consented_at": string
          "expires_at": string | null
          "revoked_at": string | null
        }
        Insert: {
          "id"?: string
          "learner_user_id": string
          "organization_id": string
          "purpose": string
          "scopes": Array<string>
          "consented_at"?: string
          "expires_at"?: string | null
          "revoked_at"?: string | null
        }
        Update: {
          "id"?: string
          "learner_user_id"?: string
          "organization_id"?: string
          "purpose"?: string
          "scopes"?: Array<string>
          "consented_at"?: string
          "expires_at"?: string | null
          "revoked_at"?: string | null
        }
        Relationships: []
      }
      "integration_clients": {
        Row: {
          "id": string
          "organization_id": string | null
          "name": string
          "client_type": string
          "scopes": Array<string>
          "secret_hash": string | null
          "status": string
          "rate_limit_per_minute": number
          "last_used_at": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "organization_id"?: string | null
          "name": string
          "client_type": string
          "scopes": Array<string>
          "secret_hash"?: string | null
          "status"?: string
          "rate_limit_per_minute"?: number
          "last_used_at"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "organization_id"?: string | null
          "name"?: string
          "client_type"?: string
          "scopes"?: Array<string>
          "secret_hash"?: string | null
          "status"?: string
          "rate_limit_per_minute"?: number
          "last_used_at"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "interview_feedback": {
        Row: {
          "id": string
          "interview_id": string
          "interviewer_user_id": string
          "scores": Json
          "evidence_notes": string | null
          "recommendation": string
          "submitted_at": string
        }
        Insert: {
          "id"?: string
          "interview_id": string
          "interviewer_user_id": string
          "scores": Json
          "evidence_notes"?: string | null
          "recommendation": string
          "submitted_at"?: string
        }
        Update: {
          "id"?: string
          "interview_id"?: string
          "interviewer_user_id"?: string
          "scores"?: Json
          "evidence_notes"?: string | null
          "recommendation"?: string
          "submitted_at"?: string
        }
        Relationships: []
      }
      "interview_feedback_dimensions": {
        Row: {
          "id": string
          "session_id": string
          "dimension": string
          "score": number
          "explanation": string
          "evidence_response_positions": Array<number>
        }
        Insert: {
          "id"?: string
          "session_id": string
          "dimension": string
          "score": number
          "explanation": string
          "evidence_response_positions": Array<number>
        }
        Update: {
          "id"?: string
          "session_id"?: string
          "dimension"?: string
          "score"?: number
          "explanation"?: string
          "evidence_response_positions"?: Array<number>
        }
        Relationships: []
      }
      "interview_responses": {
        Row: {
          "id": string
          "session_id": string
          "position": number
          "question_text": string
          "answer_text": string
          "ai_feedback": string
          "prompt_version": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "session_id": string
          "position": number
          "question_text": string
          "answer_text": string
          "ai_feedback": string
          "prompt_version": string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "session_id"?: string
          "position"?: number
          "question_text"?: string
          "answer_text"?: string
          "ai_feedback"?: string
          "prompt_version"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "interview_sessions": {
        Row: {
          "id": string
          "user_id": string
          "target_role_slug": string
          "language": string
          "mode": string
          "status": string
          "question_count": number
          "score_summary": Json
          "started_at": string
          "completed_at": string | null
        }
        Insert: {
          "id"?: string
          "user_id": string
          "target_role_slug": string
          "language": string
          "mode"?: string
          "status": string
          "question_count": number
          "score_summary": Json
          "started_at"?: string
          "completed_at"?: string | null
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "target_role_slug"?: string
          "language"?: string
          "mode"?: string
          "status"?: string
          "question_count"?: number
          "score_summary"?: Json
          "started_at"?: string
          "completed_at"?: string | null
        }
        Relationships: []
      }
      "jobs": {
        Row: {
          "id": string
          "organization_id": string
          "title": string
          "target_role_slug": string
          "description": string
          "location": string
          "work_type": string
          "shift_details": string | null
          "salary_min": number
          "salary_max": number
          "currency": string
          "experience_min_months": number
          "requirements": Json
          "status": string
          "published_at": string | null
          "closes_at": string | null
        }
        Insert: {
          "id"?: string
          "organization_id": string
          "title": string
          "target_role_slug": string
          "description": string
          "location": string
          "work_type": string
          "shift_details"?: string | null
          "salary_min": number
          "salary_max": number
          "currency"?: string
          "experience_min_months"?: number
          "requirements": Json
          "status": string
          "published_at"?: string | null
          "closes_at"?: string | null
        }
        Update: {
          "id"?: string
          "organization_id"?: string
          "title"?: string
          "target_role_slug"?: string
          "description"?: string
          "location"?: string
          "work_type"?: string
          "shift_details"?: string | null
          "salary_min"?: number
          "salary_max"?: number
          "currency"?: string
          "experience_min_months"?: number
          "requirements"?: Json
          "status"?: string
          "published_at"?: string | null
          "closes_at"?: string | null
        }
        Relationships: []
      }
      "learner_dashboard_rollups": {
        Row: {
          "user_id": string | null
          "readiness_score": number | null
          "completed_lessons": number | null
          "verified_evidence": number | null
          "application_count": number | null
          "unread_notifications": number | null
        }
        Insert: {
          "user_id"?: string | null
          "readiness_score"?: number | null
          "completed_lessons"?: number | null
          "verified_evidence"?: number | null
          "application_count"?: number | null
          "unread_notifications"?: number | null
        }
        Update: {
          "user_id"?: string | null
          "readiness_score"?: number | null
          "completed_lessons"?: number | null
          "verified_evidence"?: number | null
          "application_count"?: number | null
          "unread_notifications"?: number | null
        }
        Relationships: []
      }
      "learner_profiles": {
        Row: {
          "user_id": string
          "full_name": string
          "institute_name": string | null
          "education_level": string
          "trade": string
          "current_semester": number | null
          "target_role_slug": string
          "home_location": string
          "mobility_preference": string
          "preferred_language": string
          "profile_visibility": string
          "onboarding_completed_at": string | null
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "user_id": string
          "full_name": string
          "institute_name"?: string | null
          "education_level": string
          "trade": string
          "current_semester"?: number | null
          "target_role_slug": string
          "home_location": string
          "mobility_preference": string
          "preferred_language"?: string
          "profile_visibility"?: string
          "onboarding_completed_at"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "user_id"?: string
          "full_name"?: string
          "institute_name"?: string | null
          "education_level"?: string
          "trade"?: string
          "current_semester"?: number | null
          "target_role_slug"?: string
          "home_location"?: string
          "mobility_preference"?: string
          "preferred_language"?: string
          "profile_visibility"?: string
          "onboarding_completed_at"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: []
      }
      "learner_support_actions": {
        Row: {
          "id": string
          "organization_id": string
          "cohort_id": string | null
          "learner_user_id": string
          "signal_type": string
          "suggested_action": string | null
          "status": string
          "assigned_to": string | null
          "note": string | null
          "due_at": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "organization_id": string
          "cohort_id"?: string | null
          "learner_user_id": string
          "signal_type": string
          "suggested_action"?: string | null
          "status"?: string
          "assigned_to"?: string | null
          "note"?: string | null
          "due_at"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "organization_id"?: string
          "cohort_id"?: string | null
          "learner_user_id"?: string
          "signal_type"?: string
          "suggested_action"?: string | null
          "status"?: string
          "assigned_to"?: string | null
          "note"?: string | null
          "due_at"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "learning_lessons": {
        Row: {
          "id": string
          "unit_id": string
          "position": number
          "lesson_type": string
          "title": Json
          "objective": Json
          "youtube_video_id": string | null
          "drive_file_id": string | null
          "duration_seconds": number | null
          "content_reviewed_at": string | null
          "status": string
        }
        Insert: {
          "id"?: string
          "unit_id": string
          "position": number
          "lesson_type": string
          "title": Json
          "objective": Json
          "youtube_video_id"?: string | null
          "drive_file_id"?: string | null
          "duration_seconds"?: number | null
          "content_reviewed_at"?: string | null
          "status": string
        }
        Update: {
          "id"?: string
          "unit_id"?: string
          "position"?: number
          "lesson_type"?: string
          "title"?: Json
          "objective"?: Json
          "youtube_video_id"?: string | null
          "drive_file_id"?: string | null
          "duration_seconds"?: number | null
          "content_reviewed_at"?: string | null
          "status"?: string
        }
        Relationships: []
      }
      "learning_notes": {
        Row: {
          "id": string
          "user_id": string
          "lesson_id": string
          "body": string
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "lesson_id": string
          "body": string
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "lesson_id"?: string
          "body"?: string
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: []
      }
      "learning_path_versions": {
        Row: {
          "id": string
          "path_key": string
          "version": number
          "title_en": string
          "title_hi": string | null
          "role_slug": string
          "skill_sequence": Json
          "status": string
          "created_by": string
          "published_at": string | null
        }
        Insert: {
          "id"?: string
          "path_key": string
          "version": number
          "title_en": string
          "title_hi"?: string | null
          "role_slug": string
          "skill_sequence": Json
          "status"?: string
          "created_by": string
          "published_at"?: string | null
        }
        Update: {
          "id"?: string
          "path_key"?: string
          "version"?: number
          "title_en"?: string
          "title_hi"?: string | null
          "role_slug"?: string
          "skill_sequence"?: Json
          "status"?: string
          "created_by"?: string
          "published_at"?: string | null
        }
        Relationships: []
      }
      "learning_paths": {
        Row: {
          "id": string
          "user_id": string
          "target_role_slug": string
          "source_attempt_id": string | null
          "status": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "target_role_slug": string
          "source_attempt_id"?: string | null
          "status"?: string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "target_role_slug"?: string
          "source_attempt_id"?: string | null
          "status"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "learning_progress": {
        Row: {
          "user_id": string
          "lesson_id": string
          "status": string
          "progress_percent": number
          "last_position_seconds": number
          "started_at": string | null
          "completed_at": string | null
          "updated_at": string
        }
        Insert: {
          "user_id": string
          "lesson_id": string
          "status"?: string
          "progress_percent"?: number
          "last_position_seconds"?: number
          "started_at"?: string | null
          "completed_at"?: string | null
          "updated_at"?: string
        }
        Update: {
          "user_id"?: string
          "lesson_id"?: string
          "status"?: string
          "progress_percent"?: number
          "last_position_seconds"?: number
          "started_at"?: string | null
          "completed_at"?: string | null
          "updated_at"?: string
        }
        Relationships: []
      }
      "learning_units": {
        Row: {
          "id": string
          "version": string
          "position": number
          "skill_slug": string
          "title": Json
          "description": Json
          "status": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "version": string
          "position": number
          "skill_slug": string
          "title": Json
          "description": Json
          "status": string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "version"?: string
          "position"?: number
          "skill_slug"?: string
          "title"?: Json
          "description"?: Json
          "status"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "locale_content_packs": {
        Row: {
          "id": string
          "locale": string
          "region_code": string
          "namespace": string
          "version": string
          "messages": Json
          "status": string
          "reviewed_by": string | null
          "reviewed_at": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "locale": string
          "region_code": string
          "namespace": string
          "version": string
          "messages": Json
          "status"?: string
          "reviewed_by"?: string | null
          "reviewed_at"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "locale"?: string
          "region_code"?: string
          "namespace"?: string
          "version"?: string
          "messages"?: Json
          "status"?: string
          "reviewed_by"?: string | null
          "reviewed_at"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "media_assets": {
        Row: {
          "id": string
          "document_id": string | null
          "provider": string
          "external_id": string
          "privacy_mode": string
          "validation_status": string
          "last_checked_at": string | null
          "next_check_at": string
          "failure_count": number
          "metadata": Json
        }
        Insert: {
          "id"?: string
          "document_id"?: string | null
          "provider": string
          "external_id": string
          "privacy_mode"?: string
          "validation_status"?: string
          "last_checked_at"?: string | null
          "next_check_at"?: string
          "failure_count"?: number
          "metadata": Json
        }
        Update: {
          "id"?: string
          "document_id"?: string | null
          "provider"?: string
          "external_id"?: string
          "privacy_mode"?: string
          "validation_status"?: string
          "last_checked_at"?: string | null
          "next_check_at"?: string
          "failure_count"?: number
          "metadata"?: Json
        }
        Relationships: []
      }
      "metric_definitions": {
        Row: {
          "metric_key": string
          "version": string
          "label_en": string
          "label_hi": string | null
          "grain": string
          "source_description": string
          "minimum_group_size": number
          "owner": string
          "status": string
          "effective_at": string
          "retired_at": string | null
          "created_at": string
        }
        Insert: {
          "metric_key": string
          "version": string
          "label_en": string
          "label_hi"?: string | null
          "grain": string
          "source_description": string
          "minimum_group_size"?: number
          "owner": string
          "status"?: string
          "effective_at"?: string
          "retired_at"?: string | null
          "created_at"?: string
        }
        Update: {
          "metric_key"?: string
          "version"?: string
          "label_en"?: string
          "label_hi"?: string | null
          "grain"?: string
          "source_description"?: string
          "minimum_group_size"?: number
          "owner"?: string
          "status"?: string
          "effective_at"?: string
          "retired_at"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "model_releases": {
        Row: {
          "id": string
          "model_key": string
          "version": string
          "purpose": string
          "provider": string
          "evaluation_summary": Json
          "risk_level": string
          "approved_by": string | null
          "approved_at": string | null
          "status": string
        }
        Insert: {
          "id"?: string
          "model_key": string
          "version": string
          "purpose": string
          "provider": string
          "evaluation_summary": Json
          "risk_level": string
          "approved_by"?: string | null
          "approved_at"?: string | null
          "status": string
        }
        Update: {
          "id"?: string
          "model_key"?: string
          "version"?: string
          "purpose"?: string
          "provider"?: string
          "evaluation_summary"?: Json
          "risk_level"?: string
          "approved_by"?: string | null
          "approved_at"?: string | null
          "status"?: string
        }
        Relationships: []
      }
      "notification_deliveries": {
        Row: {
          "id": string
          "notification_id": string
          "channel": string
          "template_id": string | null
          "status": string
          "provider_message_id": string | null
          "error_code": string | null
          "attempt_count": number
          "scheduled_at": string | null
          "sent_at": string | null
          "delivered_at": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "notification_id": string
          "channel": string
          "template_id"?: string | null
          "status"?: string
          "provider_message_id"?: string | null
          "error_code"?: string | null
          "attempt_count"?: number
          "scheduled_at"?: string | null
          "sent_at"?: string | null
          "delivered_at"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "notification_id"?: string
          "channel"?: string
          "template_id"?: string | null
          "status"?: string
          "provider_message_id"?: string | null
          "error_code"?: string | null
          "attempt_count"?: number
          "scheduled_at"?: string | null
          "sent_at"?: string | null
          "delivered_at"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "notification_templates": {
        Row: {
          "id": string
          "template_key": string
          "channel": string
          "language": string
          "subject_template": string | null
          "body_template": string
          "action_label": string | null
          "required_variables": Array<string>
          "version": number
          "status": string
          "approved_by": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "template_key": string
          "channel": string
          "language": string
          "subject_template"?: string | null
          "body_template": string
          "action_label"?: string | null
          "required_variables": Array<string>
          "version": number
          "status"?: string
          "approved_by"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "template_key"?: string
          "channel"?: string
          "language"?: string
          "subject_template"?: string | null
          "body_template"?: string
          "action_label"?: string | null
          "required_variables"?: Array<string>
          "version"?: number
          "status"?: string
          "approved_by"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "notifications": {
        Row: {
          "id": string
          "user_id": string
          "category": string
          "priority": string
          "title": string
          "body": string
          "action_url": string | null
          "action_label": string | null
          "dedupe_key": string | null
          "read_at": string | null
          "archived_at": string | null
          "expires_at": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "category": string
          "priority"?: string
          "title": string
          "body": string
          "action_url"?: string | null
          "action_label"?: string | null
          "dedupe_key"?: string | null
          "read_at"?: string | null
          "archived_at"?: string | null
          "expires_at"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "category"?: string
          "priority"?: string
          "title"?: string
          "body"?: string
          "action_url"?: string | null
          "action_label"?: string | null
          "dedupe_key"?: string | null
          "read_at"?: string | null
          "archived_at"?: string | null
          "expires_at"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "occupation_roles": {
        Row: {
          "slug": string
          "title_en": string
          "title_hi": string | null
          "sector": string
          "description_en": string
          "description_hi": string | null
          "tasks": Json
          "skill_requirements": Json
          "wage_min": number | null
          "wage_max": number | null
          "currency": string
          "status": string
          "taxonomy_refs": Json
          "updated_at": string
        }
        Insert: {
          "slug": string
          "title_en": string
          "title_hi"?: string | null
          "sector": string
          "description_en": string
          "description_hi"?: string | null
          "tasks": Json
          "skill_requirements": Json
          "wage_min"?: number | null
          "wage_max"?: number | null
          "currency"?: string
          "status"?: string
          "taxonomy_refs": Json
          "updated_at"?: string
        }
        Update: {
          "slug"?: string
          "title_en"?: string
          "title_hi"?: string | null
          "sector"?: string
          "description_en"?: string
          "description_hi"?: string | null
          "tasks"?: Json
          "skill_requirements"?: Json
          "wage_min"?: number | null
          "wage_max"?: number | null
          "currency"?: string
          "status"?: string
          "taxonomy_refs"?: Json
          "updated_at"?: string
        }
        Relationships: []
      }
      "operational_errors": {
        Row: {
          "id": number
          "service": string
          "error_code": string
          "route": string | null
          "severity": string
          "request_id": string | null
          "metadata": Json
          "created_at": string
        }
        Insert: {
          "id"?: number
          "service": string
          "error_code": string
          "route"?: string | null
          "severity": string
          "request_id"?: string | null
          "metadata": Json
          "created_at"?: string
        }
        Update: {
          "id"?: number
          "service"?: string
          "error_code"?: string
          "route"?: string | null
          "severity"?: string
          "request_id"?: string | null
          "metadata"?: Json
          "created_at"?: string
        }
        Relationships: []
      }
      "opportunity_matches": {
        Row: {
          "id": string
          "user_id": string
          "job_id": string
          "match_version": string
          "score": number
          "explanation": Json
          "missing_signals": Json
          "calculated_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "job_id": string
          "match_version": string
          "score": number
          "explanation": Json
          "missing_signals": Json
          "calculated_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "job_id"?: string
          "match_version"?: string
          "score"?: number
          "explanation"?: Json
          "missing_signals"?: Json
          "calculated_at"?: string
        }
        Relationships: []
      }
      "organization_invitations": {
        Row: {
          "id": string
          "organization_id": string
          "email": string
          "role": string
          "token_hash": string
          "status": string
          "invited_by": string
          "expires_at": string
          "accepted_by": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "organization_id": string
          "email": string
          "role": string
          "token_hash": string
          "status"?: string
          "invited_by": string
          "expires_at"?: string
          "accepted_by"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "organization_id"?: string
          "email"?: string
          "role"?: string
          "token_hash"?: string
          "status"?: string
          "invited_by"?: string
          "expires_at"?: string
          "accepted_by"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "organization_memberships": {
        Row: {
          "id": string
          "organization_id": string
          "user_id": string
          "role": "owner" | "admin" | "placement_officer" | "faculty" | "reviewer" | "viewer"
          "status": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "organization_id": string
          "user_id": string
          "role"?: "owner" | "admin" | "placement_officer" | "faculty" | "reviewer" | "viewer"
          "status"?: string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "organization_id"?: string
          "user_id"?: string
          "role"?: "owner" | "admin" | "placement_officer" | "faculty" | "reviewer" | "viewer"
          "status"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "organizations": {
        Row: {
          "id": string
          "name": string
          "organization_type": string
          "verification_status": string
          "website": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "name": string
          "organization_type": string
          "verification_status"?: string
          "website"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "name"?: string
          "organization_type"?: string
          "verification_status"?: string
          "website"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "outbox_consumptions": {
        Row: {
          "event_id": number
          "consumer_key": string
          "status": string
          "result": Json | null
          "last_error": string | null
          "started_at": string
          "completed_at": string | null
        }
        Insert: {
          "event_id": number
          "consumer_key": string
          "status": string
          "result"?: Json | null
          "last_error"?: string | null
          "started_at"?: string
          "completed_at"?: string | null
        }
        Update: {
          "event_id"?: number
          "consumer_key"?: string
          "status"?: string
          "result"?: Json | null
          "last_error"?: string | null
          "started_at"?: string
          "completed_at"?: string | null
        }
        Relationships: []
      }
      "partner_verification_cases": {
        Row: {
          "id": string
          "organization_id": string
          "assigned_to": string | null
          "checks": Json
          "risk_rating": string | null
          "status": string
          "decision_note": string | null
          "created_at": string
          "decided_at": string | null
        }
        Insert: {
          "id"?: string
          "organization_id": string
          "assigned_to"?: string | null
          "checks": Json
          "risk_rating"?: string | null
          "status"?: string
          "decision_note"?: string | null
          "created_at"?: string
          "decided_at"?: string | null
        }
        Update: {
          "id"?: string
          "organization_id"?: string
          "assigned_to"?: string | null
          "checks"?: Json
          "risk_rating"?: string | null
          "status"?: string
          "decision_note"?: string | null
          "created_at"?: string
          "decided_at"?: string | null
        }
        Relationships: []
      }
      "path_units": {
        Row: {
          "path_id": string
          "unit_id": string
          "position": number
          "reason": Json
        }
        Insert: {
          "path_id": string
          "unit_id": string
          "position": number
          "reason": Json
        }
        Update: {
          "path_id"?: string
          "unit_id"?: string
          "position"?: number
          "reason"?: Json
        }
        Relationships: []
      }
      "platform_roles": {
        Row: {
          "user_id": string
          "role": string
          "active": boolean
          "created_at": string
        }
        Insert: {
          "user_id": string
          "role": string
          "active"?: boolean
          "created_at"?: string
        }
        Update: {
          "user_id"?: string
          "role"?: string
          "active"?: boolean
          "created_at"?: string
        }
        Relationships: []
      }
      "portfolio_items": {
        Row: {
          "id": string
          "user_id": string
          "item_type": string
          "title": string
          "summary": string | null
          "skill_slugs": Array<string>
          "source_ref": string | null
          "verification_status": string
          "visibility": string
          "occurred_at": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "item_type": string
          "title": string
          "summary"?: string | null
          "skill_slugs": Array<string>
          "source_ref"?: string | null
          "verification_status"?: string
          "visibility"?: string
          "occurred_at": string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "item_type"?: string
          "title"?: string
          "summary"?: string | null
          "skill_slugs"?: Array<string>
          "source_ref"?: string | null
          "verification_status"?: string
          "visibility"?: string
          "occurred_at"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "profile_share_links": {
        Row: {
          "id": string
          "user_id": string
          "resume_version_id": string | null
          "token_hash": string
          "visible_sections": Array<string>
          "expires_at": string
          "revoked_at": string | null
          "max_views": number | null
          "view_count": number
          "created_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "resume_version_id"?: string | null
          "token_hash": string
          "visible_sections": Array<string>
          "expires_at": string
          "revoked_at"?: string | null
          "max_views"?: number | null
          "view_count"?: number
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "resume_version_id"?: string | null
          "token_hash"?: string
          "visible_sections"?: Array<string>
          "expires_at"?: string
          "revoked_at"?: string | null
          "max_views"?: number | null
          "view_count"?: number
          "created_at"?: string
        }
        Relationships: []
      }
      "profile_share_views": {
        Row: {
          "id": number
          "share_link_id": string
          "viewer_fingerprint_hash": string | null
          "viewed_at": string
        }
        Insert: {
          "id"?: number
          "share_link_id": string
          "viewer_fingerprint_hash"?: string | null
          "viewed_at"?: string
        }
        Update: {
          "id"?: number
          "share_link_id"?: string
          "viewer_fingerprint_hash"?: string | null
          "viewed_at"?: string
        }
        Relationships: []
      }
      "program_memberships": {
        Row: {
          "id": string
          "organization_id": string
          "user_id": string
          "role": string
          "status": string
        }
        Insert: {
          "id"?: string
          "organization_id": string
          "user_id": string
          "role": string
          "status"?: string
        }
        Update: {
          "id"?: string
          "organization_id"?: string
          "user_id"?: string
          "role"?: string
          "status"?: string
        }
        Relationships: []
      }
      "prompt_versions": {
        Row: {
          "id": string
          "prompt_key": string
          "version": string
          "system_template": string
          "input_schema": Json
          "output_schema": Json
          "model_key": string
          "status": string
          "evaluation_summary": Json
          "created_by": string
          "approved_by": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "prompt_key": string
          "version": string
          "system_template": string
          "input_schema": Json
          "output_schema": Json
          "model_key": string
          "status": string
          "evaluation_summary": Json
          "created_by": string
          "approved_by"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "prompt_key"?: string
          "version"?: string
          "system_template"?: string
          "input_schema"?: Json
          "output_schema"?: Json
          "model_key"?: string
          "status"?: string
          "evaluation_summary"?: Json
          "created_by"?: string
          "approved_by"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "public_metric_releases": {
        Row: {
          "id": string
          "metric_key": string
          "label_en": string
          "label_hi": string | null
          "metric_value": number
          "unit": string
          "methodology_version": string
          "period_end": string
          "eligible_count": number
          "suppression_threshold": number
          "published_at": string | null
        }
        Insert: {
          "id"?: string
          "metric_key": string
          "label_en": string
          "label_hi"?: string | null
          "metric_value": number
          "unit": string
          "methodology_version": string
          "period_end": string
          "eligible_count": number
          "suppression_threshold"?: number
          "published_at"?: string | null
        }
        Update: {
          "id"?: string
          "metric_key"?: string
          "label_en"?: string
          "label_hi"?: string | null
          "metric_value"?: number
          "unit"?: string
          "methodology_version"?: string
          "period_end"?: string
          "eligible_count"?: number
          "suppression_threshold"?: number
          "published_at"?: string | null
        }
        Relationships: []
      }
      "public_policy_versions": {
        Row: {
          "id": string
          "policy_key": string
          "version": string
          "title_en": string
          "title_hi": string | null
          "body_en": string
          "body_hi": string | null
          "status": string
          "effective_at": string | null
          "approved_by": string | null
        }
        Insert: {
          "id"?: string
          "policy_key": string
          "version": string
          "title_en": string
          "title_hi"?: string | null
          "body_en": string
          "body_hi"?: string | null
          "status"?: string
          "effective_at"?: string | null
          "approved_by"?: string | null
        }
        Update: {
          "id"?: string
          "policy_key"?: string
          "version"?: string
          "title_en"?: string
          "title_hi"?: string | null
          "body_en"?: string
          "body_hi"?: string | null
          "status"?: string
          "effective_at"?: string | null
          "approved_by"?: string | null
        }
        Relationships: []
      }
      "public_trust_reports": {
        Row: {
          "id": string
          "report_type": string
          "contact_email": string | null
          "summary": string
          "preferred_language": string
          "consent_to_contact": boolean
          "reference_code": string | null
          "status": string
          "assigned_to": string | null
          "created_at": string
          "resolved_at": string | null
        }
        Insert: {
          "id"?: string
          "report_type": string
          "contact_email"?: string | null
          "summary": string
          "preferred_language"?: string
          "consent_to_contact"?: boolean
          "reference_code"?: string | null
          "status"?: string
          "assigned_to"?: string | null
          "created_at"?: string
          "resolved_at"?: string | null
        }
        Update: {
          "id"?: string
          "report_type"?: string
          "contact_email"?: string | null
          "summary"?: string
          "preferred_language"?: string
          "consent_to_contact"?: boolean
          "reference_code"?: string | null
          "status"?: string
          "assigned_to"?: string | null
          "created_at"?: string
          "resolved_at"?: string | null
        }
        Relationships: []
      }
      "question_blueprints": {
        Row: {
          "id": string
          "organization_id": string | null
          "title": string
          "role_slug": string
          "version": number
          "skill_distribution": Json
          "difficulty_distribution": Json
          "status": string
          "created_by": string
        }
        Insert: {
          "id"?: string
          "organization_id"?: string | null
          "title": string
          "role_slug": string
          "version": number
          "skill_distribution": Json
          "difficulty_distribution": Json
          "status"?: string
          "created_by": string
        }
        Update: {
          "id"?: string
          "organization_id"?: string | null
          "title"?: string
          "role_slug"?: string
          "version"?: number
          "skill_distribution"?: Json
          "difficulty_distribution"?: Json
          "status"?: string
          "created_by"?: string
        }
        Relationships: []
      }
      "rate_limit_buckets": {
        Row: {
          "subject_type": string
          "subject_hash": string
          "action": string
          "window_started_at": string
          "request_count": number
          "updated_at": string
        }
        Insert: {
          "subject_type": string
          "subject_hash": string
          "action": string
          "window_started_at": string
          "request_count"?: number
          "updated_at"?: string
        }
        Update: {
          "subject_type"?: string
          "subject_hash"?: string
          "action"?: string
          "window_started_at"?: string
          "request_count"?: number
          "updated_at"?: string
        }
        Relationships: []
      }
      "readiness_snapshots": {
        Row: {
          "id": string
          "user_id": string
          "target_role_slug": string
          "index_version": string
          "overall_score": number
          "dimensions": Json
          "explanation": Json
          "calculated_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "target_role_slug": string
          "index_version": string
          "overall_score": number
          "dimensions": Json
          "explanation": Json
          "calculated_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "target_role_slug"?: string
          "index_version"?: string
          "overall_score"?: number
          "dimensions"?: Json
          "explanation"?: Json
          "calculated_at"?: string
        }
        Relationships: []
      }
      "regions": {
        Row: {
          "code": string
          "name_en": string
          "name_hi": string | null
          "level": string
          "parent_code": string | null
          "status": string
          "created_at": string
        }
        Insert: {
          "code": string
          "name_en": string
          "name_hi"?: string | null
          "level": string
          "parent_code"?: string | null
          "status"?: string
          "created_at"?: string
        }
        Update: {
          "code"?: string
          "name_en"?: string
          "name_hi"?: string | null
          "level"?: string
          "parent_code"?: string | null
          "status"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "resource_taxonomy_mappings": {
        Row: {
          "resource_type": string
          "resource_id": string
          "taxonomy_key": string
          "taxonomy_version": string
          "term_code": string
          "region_code": string | null
          "confidence": number | null
          "reviewed_by": string | null
          "reviewed_at": string | null
        }
        Insert: {
          "resource_type": string
          "resource_id": string
          "taxonomy_key": string
          "taxonomy_version": string
          "term_code": string
          "region_code"?: string | null
          "confidence"?: number | null
          "reviewed_by"?: string | null
          "reviewed_at"?: string | null
        }
        Update: {
          "resource_type"?: string
          "resource_id"?: string
          "taxonomy_key"?: string
          "taxonomy_version"?: string
          "term_code"?: string
          "region_code"?: string | null
          "confidence"?: number | null
          "reviewed_by"?: string | null
          "reviewed_at"?: string | null
        }
        Relationships: []
      }
      "resume_versions": {
        Row: {
          "id": string
          "user_id": string
          "title": string
          "role_slug": string
          "content": Json
          "version": number
          "created_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "title": string
          "role_slug": string
          "content": Json
          "version": number
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "title"?: string
          "role_slug"?: string
          "content"?: Json
          "version"?: number
          "created_at"?: string
        }
        Relationships: []
      }
      "retention_policies": {
        Row: {
          "record_category": string
          "hot_days": number
          "archive_days": number
          "delete_days": number | null
          "legal_basis": string
          "owner": string
          "updated_at": string
        }
        Insert: {
          "record_category": string
          "hot_days": number
          "archive_days": number
          "delete_days"?: number | null
          "legal_basis": string
          "owner": string
          "updated_at"?: string
        }
        Update: {
          "record_category"?: string
          "hot_days"?: number
          "archive_days"?: number
          "delete_days"?: number | null
          "legal_basis"?: string
          "owner"?: string
          "updated_at"?: string
        }
        Relationships: []
      }
      "role_demand_snapshots": {
        Row: {
          "id": string
          "role_slug": string
          "geography_code": string
          "period_end": string
          "open_role_count": number
          "growth_percent": number | null
          "source_method": string
        }
        Insert: {
          "id"?: string
          "role_slug": string
          "geography_code": string
          "period_end": string
          "open_role_count": number
          "growth_percent"?: number | null
          "source_method": string
        }
        Update: {
          "id"?: string
          "role_slug"?: string
          "geography_code"?: string
          "period_end"?: string
          "open_role_count"?: number
          "growth_percent"?: number | null
          "source_method"?: string
        }
        Relationships: []
      }
      "saved_roles": {
        Row: {
          "user_id": string
          "role_slug": string
          "saved_at": string
        }
        Insert: {
          "user_id": string
          "role_slug": string
          "saved_at"?: string
        }
        Update: {
          "user_id"?: string
          "role_slug"?: string
          "saved_at"?: string
        }
        Relationships: []
      }
      "scheduled_events": {
        Row: {
          "id": string
          "event_type": string
          "title": string
          "starts_at": string
          "ends_at": string
          "timezone": string
          "mode": string
          "meeting_ref": string | null
          "location": string | null
          "status": string
          "created_by": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "event_type": string
          "title": string
          "starts_at": string
          "ends_at": string
          "timezone": string
          "mode": string
          "meeting_ref"?: string | null
          "location"?: string | null
          "status"?: string
          "created_by": string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "event_type"?: string
          "title"?: string
          "starts_at"?: string
          "ends_at"?: string
          "timezone"?: string
          "mode"?: string
          "meeting_ref"?: string | null
          "location"?: string | null
          "status"?: string
          "created_by"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "service_level_objectives": {
        Row: {
          "service_key": string
          "version": string
          "indicator": string
          "target": number
          "window_days": number
          "owner": string
          "status": string
        }
        Insert: {
          "service_key": string
          "version": string
          "indicator": string
          "target": number
          "window_days": number
          "owner": string
          "status"?: string
        }
        Update: {
          "service_key"?: string
          "version"?: string
          "indicator"?: string
          "target"?: number
          "window_days"?: number
          "owner"?: string
          "status"?: string
        }
        Relationships: []
      }
      "skill_evidence": {
        Row: {
          "id": string
          "user_id": string
          "skill_slug": string
          "evidence_type": string
          "title": string
          "description": string | null
          "storage_path": string | null
          "external_url": string | null
          "verification_status": string
          "verifier_id": string | null
          "verified_at": string | null
          "created_at": string
          "submission_metadata": Json
          "submitted_at": string
          "revision_of": string | null
        }
        Insert: {
          "id"?: string
          "user_id": string
          "skill_slug": string
          "evidence_type": string
          "title": string
          "description"?: string | null
          "storage_path"?: string | null
          "external_url"?: string | null
          "verification_status"?: string
          "verifier_id"?: string | null
          "verified_at"?: string | null
          "created_at"?: string
          "submission_metadata": Json
          "submitted_at"?: string
          "revision_of"?: string | null
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "skill_slug"?: string
          "evidence_type"?: string
          "title"?: string
          "description"?: string | null
          "storage_path"?: string | null
          "external_url"?: string | null
          "verification_status"?: string
          "verifier_id"?: string | null
          "verified_at"?: string | null
          "created_at"?: string
          "submission_metadata"?: Json
          "submitted_at"?: string
          "revision_of"?: string | null
        }
        Relationships: []
      }
      "skill_graph_nodes": {
        Row: {
          "id": string
          "user_id": string
          "role_slug": string
          "skill_slug": string
          "proficiency_score": number | null
          "confidence": string
          "evidence_strength": number
          "freshness_at": string | null
          "calculation_version": string
          "explanation": Json
          "updated_at": string
        }
        Insert: {
          "id"?: string
          "user_id": string
          "role_slug": string
          "skill_slug": string
          "proficiency_score"?: number | null
          "confidence": string
          "evidence_strength"?: number
          "freshness_at"?: string | null
          "calculation_version": string
          "explanation": Json
          "updated_at"?: string
        }
        Update: {
          "id"?: string
          "user_id"?: string
          "role_slug"?: string
          "skill_slug"?: string
          "proficiency_score"?: number | null
          "confidence"?: string
          "evidence_strength"?: number
          "freshness_at"?: string | null
          "calculation_version"?: string
          "explanation"?: Json
          "updated_at"?: string
        }
        Relationships: []
      }
      "structured_interviews": {
        Row: {
          "id": string
          "application_id": string
          "scheduled_at": string | null
          "duration_minutes": number
          "mode": string
          "rubric": Json
          "status": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "application_id": string
          "scheduled_at"?: string | null
          "duration_minutes"?: number
          "mode": string
          "rubric": Json
          "status"?: string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "application_id"?: string
          "scheduled_at"?: string | null
          "duration_minutes"?: number
          "mode"?: string
          "rubric"?: Json
          "status"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "talent_access_requests": {
        Row: {
          "id": string
          "organization_id": string
          "learner_user_id": string
          "job_id": string
          "requested_by": string
          "status": string
          "requested_scopes": Array<string>
          "message": string | null
          "expires_at": string
          "responded_at": string | null
          "created_at": string
        }
        Insert: {
          "id"?: string
          "organization_id": string
          "learner_user_id": string
          "job_id": string
          "requested_by": string
          "status"?: string
          "requested_scopes": Array<string>
          "message"?: string | null
          "expires_at"?: string
          "responded_at"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "organization_id"?: string
          "learner_user_id"?: string
          "job_id"?: string
          "requested_by"?: string
          "status"?: string
          "requested_scopes"?: Array<string>
          "message"?: string | null
          "expires_at"?: string
          "responded_at"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "taxonomy_terms": {
        Row: {
          "taxonomy_key": string
          "taxonomy_version": string
          "term_code": string
          "parent_term_code": string | null
          "label_en": string
          "label_hi": string | null
          "aliases": Array<string>
          "metadata": Json
        }
        Insert: {
          "taxonomy_key": string
          "taxonomy_version": string
          "term_code": string
          "parent_term_code"?: string | null
          "label_en": string
          "label_hi"?: string | null
          "aliases": Array<string>
          "metadata": Json
        }
        Update: {
          "taxonomy_key"?: string
          "taxonomy_version"?: string
          "term_code"?: string
          "parent_term_code"?: string | null
          "label_en"?: string
          "label_hi"?: string | null
          "aliases"?: Array<string>
          "metadata"?: Json
        }
        Relationships: []
      }
      "taxonomy_versions": {
        Row: {
          "taxonomy_key": string
          "version": string
          "region_code": string | null
          "source_name": string
          "status": string
          "effective_at": string
          "created_at": string
        }
        Insert: {
          "taxonomy_key": string
          "version": string
          "region_code"?: string | null
          "source_name": string
          "status"?: string
          "effective_at"?: string
          "created_at"?: string
        }
        Update: {
          "taxonomy_key"?: string
          "version"?: string
          "region_code"?: string | null
          "source_name"?: string
          "status"?: string
          "effective_at"?: string
          "created_at"?: string
        }
        Relationships: []
      }
      "transactional_outbox": {
        Row: {
          "id": number
          "aggregate_type": string
          "aggregate_id": string
          "event_type": string
          "payload": Json
          "status": string
          "attempt_count": number
          "available_at": string
          "locked_at": string | null
          "completed_at": string | null
          "created_at": string
          "locked_by": string | null
          "last_error": string | null
          "consumer_result": Json | null
        }
        Insert: {
          "id"?: number
          "aggregate_type": string
          "aggregate_id": string
          "event_type": string
          "payload": Json
          "status"?: string
          "attempt_count"?: number
          "available_at"?: string
          "locked_at"?: string | null
          "completed_at"?: string | null
          "created_at"?: string
          "locked_by"?: string | null
          "last_error"?: string | null
          "consumer_result"?: Json | null
        }
        Update: {
          "id"?: number
          "aggregate_type"?: string
          "aggregate_id"?: string
          "event_type"?: string
          "payload"?: Json
          "status"?: string
          "attempt_count"?: number
          "available_at"?: string
          "locked_at"?: string | null
          "completed_at"?: string | null
          "created_at"?: string
          "locked_by"?: string | null
          "last_error"?: string | null
          "consumer_result"?: Json | null
        }
        Relationships: []
      }
      "transactional_outbox_archive": {
        Row: {
          "id": number
          "aggregate_type": string
          "aggregate_id": string
          "event_type": string
          "payload": Json
          "status": string
          "attempt_count": number
          "available_at": string
          "locked_at": string | null
          "completed_at": string | null
          "created_at": string
          "locked_by": string | null
          "last_error": string | null
          "consumer_result": Json | null
        }
        Insert: {
          "id"?: number
          "aggregate_type": string
          "aggregate_id": string
          "event_type": string
          "payload": Json
          "status"?: string
          "attempt_count"?: number
          "available_at"?: string
          "locked_at"?: string | null
          "completed_at"?: string | null
          "created_at"?: string
          "locked_by"?: string | null
          "last_error"?: string | null
          "consumer_result"?: Json | null
        }
        Update: {
          "id"?: number
          "aggregate_type"?: string
          "aggregate_id"?: string
          "event_type"?: string
          "payload"?: Json
          "status"?: string
          "attempt_count"?: number
          "available_at"?: string
          "locked_at"?: string | null
          "completed_at"?: string | null
          "created_at"?: string
          "locked_by"?: string | null
          "last_error"?: string | null
          "consumer_result"?: Json | null
        }
        Relationships: []
      }
      "user_accounts": {
        Row: {
          "user_id": string
          "persona": string
          "display_name": string | null
          "preferred_language": string
          "status": string
          "terms_version": string | null
          "terms_accepted_at": string | null
          "created_at": string
          "updated_at": string
        }
        Insert: {
          "user_id": string
          "persona"?: string
          "display_name"?: string | null
          "preferred_language"?: string
          "status"?: string
          "terms_version"?: string | null
          "terms_accepted_at"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Update: {
          "user_id"?: string
          "persona"?: string
          "display_name"?: string | null
          "preferred_language"?: string
          "status"?: string
          "terms_version"?: string | null
          "terms_accepted_at"?: string | null
          "created_at"?: string
          "updated_at"?: string
        }
        Relationships: []
      }
      "user_sessions": {
        Row: {
          "user_id": string
          "session_id_hash": string
          "device_label": string | null
          "ip_region": string | null
          "last_seen_at": string
          "revoked_at": string | null
        }
        Insert: {
          "user_id": string
          "session_id_hash": string
          "device_label"?: string | null
          "ip_region"?: string | null
          "last_seen_at"?: string
          "revoked_at"?: string | null
        }
        Update: {
          "user_id"?: string
          "session_id_hash"?: string
          "device_label"?: string | null
          "ip_region"?: string | null
          "last_seen_at"?: string
          "revoked_at"?: string | null
        }
        Relationships: []
      }
      "web_vital_samples": {
        Row: {
          "id": number
          "user_id": string | null
          "metric_id": string
          "metric_name": string
          "metric_value": number
          "rating": string
          "path": string
          "navigation_type": string | null
          "created_at": string
        }
        Insert: {
          "id"?: number
          "user_id"?: string | null
          "metric_id": string
          "metric_name": string
          "metric_value": number
          "rating": string
          "path": string
          "navigation_type"?: string | null
          "created_at"?: string
        }
        Update: {
          "id"?: number
          "user_id"?: string | null
          "metric_id"?: string
          "metric_name"?: string
          "metric_value"?: number
          "rating"?: string
          "path"?: string
          "navigation_type"?: string | null
          "created_at"?: string
        }
        Relationships: []
      }
      "webhook_deliveries": {
        Row: {
          "id": number
          "integration_client_id": string
          "event_type": string
          "payload": Json
          "endpoint_url": string
          "status": string
          "attempt_count": number
          "next_attempt_at": string
          "response_code": number | null
          "last_error": string | null
          "created_at": string
          "delivered_at": string | null
          "idempotency_key": string | null
          "locked_by": string | null
          "locked_at": string | null
        }
        Insert: {
          "id"?: number
          "integration_client_id": string
          "event_type": string
          "payload": Json
          "endpoint_url": string
          "status"?: string
          "attempt_count"?: number
          "next_attempt_at"?: string
          "response_code"?: number | null
          "last_error"?: string | null
          "created_at"?: string
          "delivered_at"?: string | null
          "idempotency_key"?: string | null
          "locked_by"?: string | null
          "locked_at"?: string | null
        }
        Update: {
          "id"?: number
          "integration_client_id"?: string
          "event_type"?: string
          "payload"?: Json
          "endpoint_url"?: string
          "status"?: string
          "attempt_count"?: number
          "next_attempt_at"?: string
          "response_code"?: number | null
          "last_error"?: string | null
          "created_at"?: string
          "delivered_at"?: string | null
          "idempotency_key"?: string | null
          "locked_by"?: string | null
          "locked_at"?: string | null
        }
        Relationships: []
      }
      "webhook_subscriptions": {
        Row: {
          "id": string
          "integration_client_id": string
          "event_type": string
          "endpoint_url": string
          "status": string
          "created_at": string
        }
        Insert: {
          "id"?: string
          "integration_client_id": string
          "event_type": string
          "endpoint_url": string
          "status"?: string
          "created_at"?: string
        }
        Update: {
          "id"?: string
          "integration_client_id"?: string
          "event_type"?: string
          "endpoint_url"?: string
          "status"?: string
          "created_at"?: string
        }
        Relationships: []
      }
    };Views:Record<string,never>;Functions:{
      "accept_organization_invitation": { Args: {
          "p_token": string
        }; Returns: Json }
      "can_manage_application": { Args: {
          "app": string
        }; Returns: Json }
      "claim_background_jobs": { Args: {
          "p_limit"?: number | null
          "p_worker": string
        }; Returns: Json }
      "claim_outbox_events": { Args: {
          "p_limit"?: number | null
          "p_worker": string
        }; Returns: Json }
      "claim_webhook_deliveries": { Args: {
          "p_limit"?: number | null
          "p_worker": string
        }; Returns: Json }
      "complete_diagnostic_attempt": { Args: {
          "p_assessment_slug": string
          "p_assessment_version": string
          "p_idempotency_key": string
          "p_responses": Json
          "p_score": number
        }; Returns: Json }
      "complete_interview_session": { Args: {
          "p_idempotency_key": string
          "p_language": string
          "p_responses": Json
          "p_score_summary": Json
          "p_target_role_slug": string
        }; Returns: Json }
      "complete_learner_onboarding": { Args: {
          "p_ai_consent": boolean
          "p_education_level": string
          "p_full_name": string
          "p_home_location": string
          "p_idempotency_key": string
          "p_institute_name": string
          "p_language": string
          "p_mobility": string
          "p_profile_consent": boolean
          "p_semester": number
          "p_target_role_slug": string
          "p_trade": string
        }; Returns: Json }
      "complete_learning_lesson": { Args: {
          "p_idempotency_key": string
          "p_last_position_seconds": number
          "p_lesson_id": string
          "p_progress_percent": number
        }; Returns: Json }
      "complete_outbox_event": { Args: {
          "p_event_id": number
          "p_result"?: Json | null
          "p_worker": string
        }; Returns: Json }
      "consume_ai_quota": { Args: {
          "p_request_id": string
          "p_task": string
        }; Returns: Json }
      "consume_rate_limit": { Args: {
          "p_action": string
          "p_limit": number
          "p_subject_hash": string
          "p_subject_type": string
          "p_window_seconds": number
        }; Returns: Json }
      "enqueue_ai_analysis_job": { Args: {
          "p_idempotency_key": string
          "p_payload": Json
        }; Returns: Json }
      "enqueue_event_webhooks": { Args: {
          "p_event_id": number
        }; Returns: Json }
      "fail_outbox_event": { Args: {
          "p_error": string
          "p_event_id": number
          "p_worker": string
        }; Returns: Json }
      "finish_background_job": { Args: {
          "p_error"?: string | null
          "p_job_id": number
          "p_result"?: Json | null
          "p_success": boolean
          "p_worker": string
        }; Returns: Json }
      "finish_webhook_delivery": { Args: {
          "p_delivery_id": number
          "p_error"?: string | null
          "p_response_code": number
          "p_success": boolean
          "p_worker": string
        }; Returns: Json }
      "has_employer_role": { Args: {
          "org": string
          "roles": Array<string>
        }; Returns: Json }
      "has_org_role": { Args: {
          "org": string
          "roles": Array<string>
        }; Returns: Json }
      "has_program_role": { Args: {
          "org": string
          "roles": Array<string>
        }; Returns: Json }
      "is_active_employer_member": { Args: {
          "org": string
        }; Returns: Json }
      "is_active_org_member": { Args: {
          "org": string
        }; Returns: Json }
      "is_active_program_member": { Args: {
          "org": string
        }; Returns: Json }
      "is_platform_staff": { Args: {

        }; Returns: Json }
      "match_approved_content": { Args: {
          "p_match_count"?: number | null
          "p_query_embedding": number[]
          "p_query_text": string
        }; Returns: Json }
      "record_ai_request_audit": { Args: {
          "p_input_tokens"?: number | null
          "p_latency_ms": number
          "p_model_key": string
          "p_output_tokens"?: number | null
          "p_prompt_key": string
          "p_prompt_version": string
          "p_request_id": string
          "p_status": string
          "p_user_id": string
        }; Returns: Json }
      "rls_auto_enable": { Args: {

        }; Returns: Json }
      "submit_evidence_metadata": { Args: {
          "p_description": string
          "p_idempotency_key": string
          "p_skill_slug": string
          "p_storage_paths": Array<string>
          "p_title": string
        }; Returns: Json }
      "submit_job_application": { Args: {
          "p_idempotency_key": string
          "p_job_id": string
        }; Returns: Json }
      "update_own_account_profile": { Args: {
          "p_display_name": string
          "p_preferred_language": string
        }; Returns: Json }
    };Enums:Record<string,never>;CompositeTypes:Record<string,never>}};
