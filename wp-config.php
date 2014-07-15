<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'ppp');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost:8889');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'PLev.kFVi3exj|f2`;l*/Hp:^Pac-MD2R&;1=ju=.(NMz!ibSJw,%J|<k`9|c8dm');
define('SECURE_AUTH_KEY',  '> /H|R9sMA ~H<H=~uRkojr,s|nrvl%z`&U`$|GH`3k+cb GAJ=u81S.y+tz<y<_');
define('LOGGED_IN_KEY',    'o;]Iyq5CY}cJ?H_F1=!~P }6enaQUg4]+|s6CxZo(VtF<37q?5+px2|M/vtVG0S7');
define('NONCE_KEY',        'R&UY;7lE>k28^.gdk-+}<eJ]Q;9&o*I>7Cs{a9(h@}(lASn<8YrTPn`*PWp+3Kvy');
define('AUTH_SALT',        '+gi+:rlW*idc.h0LA,w?wJg11oHe-8,9/[&:[n]fnwl|dhw{#OoZ4+#{mXO|(fu2');
define('SECURE_AUTH_SALT', ' 2RDQ#.P[~!`dWW2,d^$t&[_E+cx^$Tj@S-r{a+|&c!RK7s4gJ]yVh>&te`e_rY*');
define('LOGGED_IN_SALT',   'GEJU`Tl[Fe^WH</G>Vw3|v$=,/>L.hZ`EzWWP8rU!ctR>j6BL1r8)InT0BujvMU0');
define('NONCE_SALT',       '{V#AT+ie]W:w3+mZ`baz`+1i5D<+^M>g>_5eK3B^!~%KV[9;ToArlM*{nJ!eAUyp');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
