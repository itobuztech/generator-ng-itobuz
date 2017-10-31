'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const log = console.log;
var shell = require('shelljs');
const updateNotifier = require('update-notifier');
const replace = require('replace');
const pkg = require('../../package.json');
const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000
});

module.exports = class extends Generator {
  prompting() {
    notifier.notify();

    // Have Yeoman greet the user.
    var logo = '\n    ;;;;;;;;;;;;;;;;;;;;;;;;;;;\n    ;;;;;;;;;;;;;;;;;;;;;;;;;;;\n    ;;;;;;;;;;;;;;;;;;;;;;;;;;;\n    ;;;;;,,,,,,,,,,,,,,,,,,;;;;\n    ;;;;;                  ;;;;\n    ;;;;;                  ;;;;\n    ;;;;;   ```````````    ;;;;\n    ;;;;;   ;;...;;;;;    ;;;;;\n    ;;;;;   ;;   ;;;;`   ,;;;;;\n    ;;;;;   ;;   ;;;:    ;;;;;;\n    ;;;;;   ;;   ;;;    ;;;;;;;\n    ;;;;;   ;;   ;;    ;;;;;;;;\n    ;;;;;   ;;   ;`   :;;;;;;;;\n    ;;;;;   ;;   :    ;;;;;;;;;\n    ;;;;;   ;;   ;,    ;;;;;;;;\n    ;;;;;   ;;   ;;:    ;;;;;;;\n    ;;;;;   ;;   ;;;;    ;;;;;;\n    ;;;;;   ;;```;;;;;    ;;;;;\n    ;;;;;   ,,,,,,,,,,,    ;;;;\n    ;;;;;                  ;;;;\n    ;;;;;                  ;;;;\n    ;;;;;::::::::::::::::::;;;;\n    ;;;;;;;;;;;;;;;;;;;;;;;;;;;\n    ;;;;;;;;;;;;;;;;;;;;;;;;;;;\n    ;;;;;;;;;;;;;;;;;;;;;;;;;;;\n    ;;;;;;;;;;;;;;;;;;;;;;;;;;;';
    this.log(logo);

    const prompts = [{
      type: 'input',
      name: 'projectname',
      message: 'Enter your project name',
      validate: function (str) {
        return str.length > 0;
      }
    },
    {
      type: 'checkbox',
      name: 'newoptions',
      message: 'choose options',
      choices: [{
        name: 'skip commit',
        value: 'skip-commit',
        checked: true
      }, {
        name: 'skip git',
        value: 'skip-git',
        checked: false
      }, {
        name: 'skip install',
        value: 'skip-install',
        checked: false
      },
      {
        name: 'skip tests',
        value: 'skip-tests',
        checked: true
      },
      {
        name: 'style: scss',
        value: 'style',
        checked: true
      },
      {
        name: 'routing',
        value: 'routing',
        checked: true
      },
      {
        name: 'prefix',
        value: 'prefix',
        checked: true
      }]
    },
    {
      name: 'includeTemplate',
      message: 'Include predefined template / module / service',
      type: 'checkbox',
      choices: [
        {
          name: 'home module / router module / interceptor',
          value: 'home',
          checked: true
        }
      ]
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('_package.json'),
      this.destinationPath('package.json')
    );
  }

  install() {
    // console.log(this.props);
    var startCommand = ' ';
    this.props.newoptions.map(item => {
      switch (item) {
        case 'style':
          item = 'style="scss"';
          break;
        case 'prefix':
          item = 'prefix=' + this.props.projectname.toLowerCase();
          break;
        default:
          item = item + '="true"';
      }
      startCommand = startCommand + ' --' + item;
    });
    log(chalk.blue(startCommand));

    this.installDependencies(
      {
        npm: true,
        bower: false,
        skipMessage: true,
        callback: function () {
          // Remove yo generator required npm deps
          shell.exec('rm -rf  package.json && rm -rf package-lock.json && rm -rf node_modules');
          // shell.exec('chmod 755 create.sh');
          // shell.exec('./create.sh');
          // shell.exec('rm -f create.sh');

          // create angular project with configs
          shell.exec('ng new ' + this.props.projectname + startCommand);

          // Copy node modules generator test purpose
          // shell.exec('cp -R aa2/node_modules ' + this.props.projectname + '/node_modules')
          // console.log(this.props.includeTemplate);

          // create home module and home component
          if (this.props.includeTemplate[0] === 'home') {
            shell.exec('git clone https://github.com/itobuztech/ng-home.git');
            shell.exec('cp -R ng-home/home ./' + this.props.projectname + '/src/app');

            // // App routing and app.component.html update
            shell.exec('cp ng-home/app/app.component.html ./' + this.props.projectname + '/src/app/app.component.html');
            shell.exec('cp ng-home/app/app-routing.module.ts ./' + this.props.projectname + '/src/app/app-routing.module.ts');

            // // Interceptor
            shell.exec('cp ng-home/app/http.interceptor.ts ./' + this.props.projectname + '/src/app/http.interceptor.ts');
            shell.exec('cp ng-home/app/app.module.ts ./' + this.props.projectname + '/src/app/app.module.ts');

            // // ENV
            shell.exec('cp -R ng-home/environments ./' + this.props.projectname + '/src');
            // // Remove template
            shell.exec('rm -rf ng-home');
            replace({
              regex: `"component": {}`,
              replacement: `"component": { "spec": false, "changeDetection": "OnPush" }`,
              paths: [this.props.projectname + '/.angular-cli.json'],
              recursive: true,
              silent: true
            });
          }

          // Run NG serve
          log(chalk.blue('Now run : `cd ' + this.props.projectname + ' && ng serve`'));
        }.bind(this)
      }
    );
  }
};
