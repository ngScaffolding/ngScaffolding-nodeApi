import * as shell from "shelljs";

// Copy all the view templates
shell.cp( "-R", "src/views", "dist/" );
shell.cp( "-R", "src/web.config", "." );

// Copy all the view templates
shell.cp( "-R", "src/views", "build/" );
shell.cp( "-R", "src/web.config", "build/" );