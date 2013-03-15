    <?php

/**
 * @file
 * Default theme implementation to display a single Drupal page.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $directory: The directory the template is located in, e.g. modules/system
 *   or themes/bartik.
 * - $is_front: TRUE if the current page is the front page.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or
 *   prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 *
 * Navigation:
 * - $main_menu (array): An array containing the Main menu links for the
 *   site, if they have been configured.
 * - $secondary_menu (array): An array containing the Secondary menu links for
 *   the site, if they have been configured.
 * - $breadcrumb: The breadcrumb trail for the current page.
 *
 * Page content (in order of occurrence in the default page.tpl.php):
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title: The page title, for use in the actual HTML content.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 * - $messages: HTML for status and error messages. Should be displayed
 *   prominently.
 * - $tabs (array): Tabs linking to any sub-pages beneath the current page
 *   (e.g., the view and edit tabs when displaying a node).
 * - $action_links (array): Actions local to the page, such as 'Add menu' on the
 *   menu administration interface.
 * - $feed_icons: A string of all feed icons for the current page.
 * - $node: The node object, if there is an automatically-loaded node
 *   associated with the page, and the node ID is the second argument
 *   in the page's path (e.g. node/12345 and node/12345/revisions, but not
 *   comment/reply/12345).
 *
 * Regions:
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['sidebar_second']: Items for the second sidebar.
 * - $page['header']: Items for the header region.
 * - $page['footer']: Items for the footer region.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 */
?>

<section id="container" class="wrap">
    <!-- header -->
    <header id="header" class="wrap">
        <?php if($is_front): ?>
            <h1 id="logo" title="<?php print $site_name; ?>"><a href="/" title="<?php print $site_name; ?>"><img src="<?php print base_path().path_to_theme(); ?>/images/logo.png" alt="<?php print $site_name; ?>" /></a></h1>
        <?php else: ?>
            <div id="logo" title="<?php print $site_name; ?>"><a href="/" title="<?php print $site_name; ?>"><img src="<?php print base_path().path_to_theme(); ?>/images/logo.png" alt="<?php print $site_name; ?>" /></a></div>
        <?php endif; ?>
        <?php print render($page['header']); ?>
        <?php print $breadcrumb; ?>
    </header> <!-- /header -->
    <!-- content top -->
    <?php if(!empty($page['content_top'])): ?>
        <section id="content-top" class="wrap">
            <?php print render($page['content_top']); ?>
        </section>
    <?php endif; ?>
    <!-- main -->
    <?php if($tabs): ?><div class="tabs"><?php print render($tabs); ?></div><?php endif; ?>
    <section id="main" class="wrap">
        <?php print $messages; ?>
        <!-- sideebar first -->
        <?php if(!empty($page['sidebar_first'])): ?>
            <div id="sidebar-first" class="sidebar float-left">
                <?php print render($page['sidebar_first']); ?>
            </div>
        <?php endif; ?>
        <!-- content -->
        <div id="content" class="wrap">
            <?php if($page['highlighted']): ?><div id="highlighted"><?php print render($page['highlighted']); ?></div><?php endif; ?>
            <?php print render($page['help']); ?>
            <?php if($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
            <?php if($title && !$is_front): ?>
                <?php print render($title_prefix); ?>
                <h1 class="title" id="page-title"><?php print $title; ?></h1>
                <?php print render($title_suffix); ?>
            <?php endif; ?>

            <?php if($is_front): ?>
                <!-- CUSTOM SCRATCHER INTERFACE -->
                <div id="scratch-canvas" class="scratch-box"></div>
                <div id="tempAjax" class="ajax-result scratch-box"></div>
                <!-- END SCRATCHER INTERFACE -->
            <?php endif; ?>

            <?php print render($page['content']); ?>
        </div> <!-- /content -->
        <!-- sidebar second-->
        <?php if(!empty($page['sidebar_second'])): ?>
            <div id="sidebar-second" class="sidebar float-right">
                <?php print render($page['sidebar_second']); ?>
            </div>
        <?php endif; ?>
    </section> <!-- /main -->
    <!-- content bottom -->
    <?php if(!empty($page['content_bottom'])): ?>
        <section id="content-bottom" class="wrap">
            <?php print render($page['content_bottom']); ?>
        </section>
    <?php endif; ?>
    <!-- footer -->
    <footer id="footer" class="wrap">
        <?php print render($page['footer']); ?>
    </footer><!-- /footer -->
</section> <!-- /container -->

