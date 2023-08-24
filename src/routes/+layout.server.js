// import { redirect } from '@sveltejs/kit';
import { blockedSubdomain } from '$lib/utils/constants/app';
import { getCurrentOrg } from '$lib/utils/services/org';
import { getSupabase, supabase } from '$lib/utils/functions/supabase';

if (!supabase) {
  getSupabase();
}

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ url, cookies }) => {
  // if (url.hostname === 'classroomio.com') {
  //   throw redirect(301, 'https://about.classroomio.com');
  // }

  let response = {
    orgSiteName: '',
    isOrgSite: false,
    skipAuth: false,
    org: {}
  };

  const debugOrgLandingPage = cookies.get('debugOrgLandingPage');
  const debugPlay = cookies.get('debugPlay');
  const debugMode = debugOrgLandingPage === 'true';
  console.log('debugOrgLandingPage', debugOrgLandingPage);

  const matches = url.host.match(/([a-z 0-9 \-]+).*classroomio[.]com/);
  const subdomain = matches?.[1] ?? '';

  if (!blockedSubdomain.includes(subdomain)) {
    const answer = Array.isArray(matches) ? !!subdomain && subdomain !== 'www' : false;

    response.isOrgSite = debugMode || answer;
    response.orgSiteName = debugMode ? 'codingdojo' : subdomain;

    response.org = await getCurrentOrg(response.orgSiteName, true);
  } else if (subdomain === 'play' || debugPlay === 'true') {
    response.skipAuth = true;
  }

  return response;
};