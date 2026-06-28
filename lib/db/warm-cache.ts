import 'server-only';
import {
  getDashboardStats, getBookingsChartData, getRevenueChartData,
  getRecentBookings, getRecentInquiries, getUpcomingDepartures,
  getNewBookingsCount, getNewInquiriesCount,
} from './queries/dashboard';
import { getBookings } from './queries/bookings';
import { getDepartures } from './queries/departures';
import { getCustomers } from './queries/customers';
import { getInquiries, getInquiryCountsByType } from './queries/inquiries';
import { getTours } from './queries/tours';
import { getGearItemsWithStats, getGearUnitsWithRentals, getRentalsForCalendar, getLateRentals } from './queries/inventory';
import { getReviews } from './queries/reviews';
import { getBlogPosts } from './queries/blog';
import { getGuides } from './queries/guides';
import { getDestinations } from './queries/destinations';

/**
 * Pre-load every main admin page's data once, so each query writes its offline
 * snapshot. Called right after a successful login (DB is provably reachable
 * there), guaranteeing the admin panel is fully viewable offline from the
 * moment the user signs in — not only after they've visited each page.
 *
 * Uses the same default params the list pages request so the cache keys match.
 * Best-effort: a single failing query never blocks login.
 */
export async function warmAdminCache(): Promise<void> {
  await Promise.allSettled([
    getDashboardStats(),
    getBookingsChartData(),
    getRevenueChartData(),
    getRecentBookings(),
    getRecentInquiries(),
    getUpcomingDepartures(),
    getNewBookingsCount(),
    getNewInquiriesCount(),
    getBookings({}),
    getDepartures(),
    getCustomers({}),
    getInquiries({}),
    getInquiryCountsByType(),
    getTours(),
    getGearItemsWithStats(),
    getGearUnitsWithRentals(),
    getRentalsForCalendar(),
    getLateRentals(),
    getReviews(),
    getBlogPosts(false),
    getGuides(),
    getDestinations(),
  ]);
}
