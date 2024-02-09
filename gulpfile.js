const gulp = require('gulp');

// Tasks
require('./gulp/dev.js');
require('./gulp/docs.js');

gulp.task(
  'start',
  gulp.series(
    'clean:dev',
    gulp.parallel(
      'generate-favicon',
      'html:dev',
      'sass:dev',
      'images:dev',
      'sprite:dev',
      'fonts:dev',
      'files:dev',
      'js:dev',
    ),
    gulp.parallel('server:dev', 'watch:dev'),
  ),
);

gulp.task(
  'docs',
  gulp.series(
    'clean:docs',
    gulp.parallel(
      'generate-favicon',
      'html:docs',
      'sass:docs',
      'images:docs',
      'sprite:docs',
      'fonts:docs',
      'files:docs',
      'js:docs',
    ),
    gulp.parallel('server:docs'),
  ),
);
