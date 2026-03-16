export enum ApiScopeEnum {
  LinkedInContentManagementScope = 'openid profile rw_ads r_events r_ads_leadgen_automation r_ads_reporting r_liteprofile r_marketing_leadgen_automation email r_ads rw_conversions r_organization_social rw_organization_admin w_member_social w_organization_social r_basicprofile r_organization_admin r_1st_connections_size',
  LinkedInAccountTrackingScope = 'r_organization_followers r_organization_social rw_organization_admin r_organization_social_feed w_member_social w_organization_social r_basicprofile w_organization_social_feed w_member_social_feed r_1st_connections_size',
  FacebookScope = 'email,public_profile,pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_posts,instagram_manage_insights,instagram_manage_comments,instagram_content_publish',
  TwitterScope = 'tweet.read tweet.moderate.write tweet.write users.read follows.read follows.write space.read mute.read mute.write like.read like.write list.read list.write block.read block.write bookmark.read bookmark.write',
}
