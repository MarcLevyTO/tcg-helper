interface User {
  id: number;
  pronouns: string | null;
  country_code: string | null;
  best_identifier: string;
  game_user_profile_picture_url: string;
}

interface UserEventStatus {
  id: number;
  best_identifier: string;
  registration_status: string;
  matches_won: number;
  matches_lost: number;
  matches_drawn: number;
  total_match_points: number;
  user: User;
}

interface Player {
  id: number;
  pronouns: string | null;
  country_code: string | null;
  best_identifier: string;
  game_user_profile_picture_url: string;
}

interface PlayerMatchRelationship {
  player_order: number | null;
  player: Player;
  user_event_status: UserEventStatus;
}

interface Match {
  id: number;
  player_match_relationships: PlayerMatchRelationship[];
  created_at: string;
  updated_at: string;
  table_number: number;
  order: number;
  status: string;
  pod_number: number | null;
  match_is_intentional_draw: boolean;
  match_is_unintentional_draw: boolean;
  match_is_bye: boolean;
  match_is_loss: boolean;
  reports_are_in_conflict: boolean;
  games_drawn: number | null;
  games_won_by_winner: number | null;
  games_won_by_loser: number | null;
  is_ghost_match: boolean;
  is_feature_match: boolean;
  deck_check_started: boolean;
  deck_check_completed: boolean;
  time_extension_seconds: number;
  team_event_match: any | null;
  tournament_round: number;
  reporting_player: number | null;
  winning_player: number | null;
  assigned_judge: any | null;
  players: number[];
}

interface TournamentMatchesResponse {
  page_size: number;
  count: number;
  total: number;
  current_page_number: number;
  next_page_number: number | null;
  next: string | null;
  previous: string | null;
  previous_page_number: number | null;
  results: Match[];
}