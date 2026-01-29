export interface Coordinates {
  type: string;
  coordinates: [number, number];
}

export interface Store {
  id: number;
  name: string;
  full_address: string;
  city: string;
  country: string;
  state: string | null;
  latitude: number;
  longitude: number;
  website: string;
  email: string;
}

export interface GameplayFormat {
  id: string;
  name: string;
}

export interface Settings {
  id: number;
  decklist_status: string;
  decklists_on_spicerack: boolean;
  event_lifecycle_status: string;
  show_registration_button: boolean;
  round_duration_in_minutes: number;
  payment_in_store: boolean;
  payment_on_spicerack: boolean;
  maximum_number_of_game_wins_per_match: number;
  maximum_number_of_draws_per_match: number | null;
  checkin_methods: string[];
  stripe_price_id: string | null;
  maximum_number_of_players_in_match: number;
  enable_waitlist: boolean;
}

export interface Round {
  id: string | number; // Assuming id can be string or number based on usage
}

export interface Standing {
  player_id: string | number;
  rank: number;
  player_name: string;
  player_username?: string;
  points: number;
  match_record: string;
  opponent_match_win_percentage: number;
  opponent_game_win_percentage: number;
}

export interface TournamentPhase {
  id: number;
  phase_name: string;
  phase_description: string;
  first_round_type: string;
  status: string;
  order_in_phases: number;
  number_of_rounds: number | null;
  round_type: string;
  rank_required_to_enter_phase: number | null;
  effective_maximum_number_of_game_wins_per_match: number;
  rounds: Round[];
}

export interface Event {
  id: number;
  full_header_image_url: string;
  start_datetime: string;
  end_datetime: string | null;
  day_2_start_datetime: string | null;
  timer_end_datetime: string | null;
  timer_paused_at_datetime: string | null;
  timer_is_running: boolean;
  description: string;
  settings: Settings;
  tournament_phases: TournamentPhase[];
  registered_user_count: number;
  full_address: string;
  name: string;
  pinned_by_store: boolean;
  use_verbatim_name: boolean;
  queue_status: string;
  game_type: string;
  source: string | null;
  event_status: string;
  event_format: string;
  event_type: string;
  pairing_system: string | null;
  rules_enforcement_level: string;
  coordinates: Coordinates;
  timezone: string;
  event_address_override: string;
  event_is_online: boolean;
  latitude: number;
  longitude: number;
  cost_in_cents: number;
  currency: string;
  capacity: number;
  url: string | null;
  number_of_rc_invites: number | null;
  top_cut_size: number | null;
  number_of_rounds: number | null;
  number_of_days: number;
  is_headlining_event: boolean;
  is_on_demand: boolean;
  prevent_sync: boolean;
  header_image: string | null;
  starting_table_number: number;
  ending_table_number: number | null;
  admin_list_display_order: number;
  prizes_awarded: boolean;
  is_test_event: boolean;
  is_template: boolean;
  tax_enabled: boolean;
  polymorphic_ctype: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  game: number;
  product_list: string | null;
  event_factory_created_by: string | null;
  event_configuration_template: string;
  banner_image: number;
  phase_template_group: string;
  game_rules_enforcement_level: string | null;
  registration_prerequisite_requires_invitation: boolean;
  store: Store;
  convention: string | null;
  gameplay_format: GameplayFormat;
  distance_in_miles: number | null;
  display_status: string;
}