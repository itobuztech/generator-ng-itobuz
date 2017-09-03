'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
var shell = require('shelljs');

module.exports = class extends Generator {
  prompting() {
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
        checked: true
      }, {
        name: 'skip install',
        value: 'skip-install',
        checked: true
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
      switch(item) {
        case 'style':
          item = 'style="scss"';
          break;
        case 'prefix':
          item = 'prefix=' + this.props.projectname.toLowerCase();
          break;
        default:
          item = item + '="true"'
      };
      startCommand = startCommand + ' --' + item
    });
    // console.log(startCommand);
    
    this.installDependencies(
      {
        npm: true,
        bower: false,
        skipMessage: true,
        callback: function () {
          shell.exec('rm -rf  package.json && rm -rf package-lock.json');
          // shell.exec('chmod 755 create.sh');
          // shell.exec('./create.sh');
          // shell.exec('rm -f create.sh');
          shell.exec('ng new ' + this.props.projectname + startCommand);
        }.bind(this)
      }
    );
  }
};
