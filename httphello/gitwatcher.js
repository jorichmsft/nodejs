
//
// The MIT License (MIT)
// Copyright (c) 2016 John Richardson
// 
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
//

//
// Periodically poll a git remote repository for updates and
// launch an action script when updates are available.
//
// 07/28/2016
//
// John Richardson
//

//
// Command line to run
//
var g_pollCommandLine = "git remote update && git status -uno";

//
// Period to run it in seconds
//
var g_pollCommandInterval = 15;

//
// The action command line is executed on success of a poll.
//
var g_actionCommandLine = "git_outofdate_actions.cmd";

//
// This is the function that executes with the results from the command
// executed periodically.
//
var periodicExecutionResult = function(error, stdout, stderr)
{
    // This is set for a non-success exit status
    if (error !== null) {
        console.error('exec error: ' + error);

        // These may be present. If so print for diagnostics.
        if (stderr != null) {
            console.error('stderr:\n' + stderr);
        }

        if (stdout != null) {
            console.log('stdout:\n' + stdout);
        }

        // Could not execute poll command, take no actions.
        return;
    }

    // stderr and stdout streams may exist as zero length
    if ((stderr != null) && (stderr.length != 0)) {
        console.log("stderror stream exists! error! length=" + stderr.length);

        console.error('stderr:\n' + stderr);

        // This may be present. If so print for diagnostics.
        if (stdout != null) {
            console.log('stdout:\n' + stdout);
        }

        // Command run returned an error, take no actions.
        return;
    }

    if ((stdout != null) && (stdout.length != 0)) {

        // Process the stdout stream for the status

        // fallthrough
    }
    else {
        console.log("no stdout returned from command execution");

        // Nothing to process, do nothing
        return;
    }

    //
    // Process a valid stdout stream from a non-failure execution status
    // for the results we are looking for.
    //

    // var g_pollCommandLine = "git remote update && git status -uno";

    //
    // If no updates:
    //
    // Fetching origin
    // On branch master
    // Your branch is up-to-date with 'origin/master'.
    // nothing to commit (use -u to show untracked files)
    //
    if (stdout.search("up-to-date") != -1) {
        console.log("Branch is up to date");

        // No actions
        return;
    }

    //
    // If updates are pending:
    //
    // Fetching origin
    // On branch master
    // Your branch is behind 'origin/master' by 1 commit, and can be fast-forwarded.
    //  (use "git pull" to update your local branch)
    // nothing to commit (use -u to show untracked files)
    //
    if (stdout.search("Your branch is behind") == -1) {

        console("branch not up-to-date, but don't recognize state");
        console.log('stdout:\n' + stdout);
        console.log("taking no actions");

        // No actions
        return;
    }

    console.log("Branch out out of date, running action " + g_actionCommandLine);

    shellExecCommandLine(g_actionCommandLine, function(error2, stdout2, stderr2) {

        if (error2 != null) {
            console("action command line failed");
        }

        console.log("action command line results:");

        dumpResults(error2, stdout2, stderr2);
    });

    return;
}

//
// This allows argument processing to be added if required.
//
var main = function(argc, argv)
{
    executeCommandPeriodically(g_pollCommandInterval, g_pollCommandLine, periodicExecutionResult);
}

//
// The rest from here on is boilerplate that typically
// does not need to change.
//

var dumpResults = function(error, stdout, stderr)
{
    // This is set for a non-success exit status
    if (error !== null) {
        console.error('exec error: ' + error);

        // These may be present. If so print for diagnostics.
        if (stderr != null) {
            console.error('stderr:\n' + stderr);
        }

        if (stdout != null) {
            console.log('stdout:\n' + stdout);
        }

        return;
    }

    // stderr and stdout streams may exist as zero length
    if ((stderr != null) && (stderr.length != 0)) {
        console.log("stderror stream exists! error! length=" + stderr.length);

        console.error('stderr:\n' + stderr);

        // This may be present. If so print for diagnostics.
        if (stdout != null) {
            console.log('stdout:\n' + stdout);
        }

        return;
    }

    if ((stdout != null) && (stdout.length != 0)) {
        console.log('stdout:\n' + stdout);
        return;
    }
    else {
        console.log("no stdout returned from successfull command execution");

        // Nothing to process, do nothing
        return;
    }
}

//
// Execute the given command periodically
//
// callback(error, stdout, stderr)
//
var executeCommandPeriodically = function(
    childProcessInterval,
    childProcessCommandLine,
    callback
    )
{
    var args = {};

    args.interval = childProcessInterval;
    args.childProcessCommandLine = childProcessCommandLine;

    // setInterval takes milliseconds
    var timerInterval = childProcessInterval * 1000;

    var timerFunction = function (args) {
        console.log("timerFunction called");
        shellExecCommandLine(args.childProcessCommandLine, callback);
    };

    var intervalObject = setInterval(timerFunction, timerInterval, args);

    console.log("gitwatcher: timer started for " + childProcessInterval + " seconds");

    // intervalObject.unref(); // do this to cause program to exit if timer is outstanding
}

//
// commandLine - Command line to execute.
//
// callback(error, stdout, stderr)
//
var shellExecCommandLine = function(commandLine, callback) {

    var exec = require('child_process').exec;
    var child;

    console.log("running commandLine: " + commandLine);
    console.log("");
    
    // This uses the OS shell
    child = exec(commandLine, function (error, stdout, stderr) {
        callback(error, stdout, stderr);
    });
}

var usage = function(bad_arg) {

    console.error("Usage: autoscript");

    if (typeof bad_arg != "undefined") {
        console.error("Bad argument " + bad_arg);
    }
}

function tracelog(message) {
    //console.log(message);
}

function errlog(message) {
    console.error(message);
}

//
// Remove argv[0] to get to the base of the standard arguments.
// The first argument will now be the script name.
//
var args = process.argv.slice(1);

// Invoke main
main(args.length, args);

