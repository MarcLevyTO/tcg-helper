import { NextResponse } from 'next/server';
import { getEventRegistrationUrl } from '@/src/utils/url';

const fetchEventRegistrationDetails = async (eventId: string): Promise<any> => {
  const apiUrl = getEventRegistrationUrl(eventId);

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch event registration details: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const eventData = await fetchEventRegistrationDetails(eventId);
    const registrations = eventData.results;
    const rosterInfo: any[] = [];

    // {
    //         "id": 1561322,
    //         "user": {
    //             "id": 136571,
    //             "best_identifier": "Ali I",
    //             "pronouns": null,
    //             "country_code": null
    //         },
    //         "registration_status": "COMPLETE",
    //         "special_user_identifier": "Ali I",
    //         "best_identifier": "Costco Wholesale",
    //         "matches_won": 0,
    //         "matches_lost": 0,
    //         "matches_drawn": 0,
    //         "total_match_points": 0,
    //         "final_place_in_standings": null,
    //         "registration_completed_datetime": "2025-12-22T19:45:59+00:00",
    //         "full_profile_picture_url": "https://storage.googleapis.com/spicerack_media/game_images/3_riftbound/profile/7cc85539-e3b.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=storages-service-account%40counterbalance-381319.iam.gserviceaccount.com%2F20251222%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20251222T204045Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=c2be508b417eb20d0f44f45bae151198fc5b941c2746ce406b40ba9b5e32e48f2d8fd12750398aeb4b4d10ad8c19abfe2d2576704f7287e908c8af3ec8c475c00aa35f74c5a802056c7feb82d91f8bda5a0750f82f75d3693d6c1c174723308a4876b61232b1ce8bcc893b71684a674399c2a388b27d2f908934e0a47a9cb10e954855752e039c30bc0f7e13c672eaa4f92c29e50406280c562e6f3d7bc5dbb281139a5b33da22899cd49402df7e83506861c8a42e16c0306c67fe5bacc56e7ef7774b06386f5b9b8633dcbc5c9cc19c3ff289c517c56834f9f5685b3947941cd049c65bd9b75556304d86684d126fcaacdae12475b3f16039531dd8ab4b1ea4",
    //         "deck_id": null
    //     },

    registrations.forEach((registration: any) => {
      rosterInfo.push({
        id: registration.id,
        user_id: registration.user.id,
        user_name: registration.user.best_identifier,
        user_full_name: registration.best_identifier,
        registration_status: registration.registration_status,
        matches_won: registration.matches_won,
        matches_lost: registration.matches_lost,
        matches_drawn: registration.matches_drawn,
        total_match_points: registration.total_match_points,
        final_place_in_standings: registration.final_place_in_standings,
        full_profile_picture_url: registration.full_profile_picture_url,
        deck_id: registration.deck_id,
      });
    });

    const responseData: any = {
      registrations: rosterInfo,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error fetching event registration data:', error.message);
    return NextResponse.json({ error: `Error fetching data: ${error.message}` }, { status: 500 });
  }
};

