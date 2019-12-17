import * as shell from "shelljs";

// Copy all the view templates
shell.cp( "-R", "src/views", "dist/" );
shell.cp( "-R", "web.config", "dist/" );

// Copy all the view templates
shell.cp( "-R", "package*.json", "build/" );
shell.cp( "-R", "src/views", "build/" );
shell.cp( "-R", "logs", "build/" );
shell.cp( "-R", "web.config", "build/" );