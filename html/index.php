<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Team assignment</title>
        
        <link href='//fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet/less" href="/html/media/less/header.less" />
        
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/less.js/2.5.3/less.min.js"></script>
    </head>
    <body>
<?php //include('nav.php'); ?>

        <section class="main-section header">
            <div class="container">
                <h1 class="text-center">Cancelled or delayed flight?<br/><small>- or -</small><br/>Lost or delayed luggage?</h1>
                <div class="row">
                    <div class="col col-sm-offset-2 col-sm-8">
                        <div class="box">
                            <div class="inner-box">
                            <div class="title">
                                <h2 class="text-center">Calculate Your Compensation</h2>
                            </div>
                            <form class="content">
                                <div class="row">
                                    <div class="form-group col col-md-6">
                                        <!--label>Flight number</label-->
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-addon">
                                                <span class="fa fa-plane"></span>
                                            </span>
                                            <input type="text" placeholder="Aeroflot" class="form-control" style="width: 67%;" />
                                            <input type="text" placeholder="2168" class="form-control text-right" style="width: 33%; border-left: 0;" />
                                        </div>
                                    </div>
                                    <div class="form-group col col-md-6">
                                        <!--label>Date</label-->
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-addon">
                                                <span class="fa fa-calendar"></span>
                                            </span>
                                            <input type="text" placeholder="01-01-2015" class="form-control text-right"/>
                                        </div>
                                    </div>
                                </div>
                                <hr class="form-group"/>
                                <div class="row">
                                    <div class="form-group col col-md-6">
                                        <!--label>Flight number</label-->
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-addon">
                                                <span class="fa fa-plane"></span>
                                            </span>
                                            <input type="text" placeholder="Aeroflot" class="form-control" style="width: 67%;" />
                                            <input type="text" placeholder="2168" class="form-control text-right" style="width: 33%; border-left: 0;" />
                                        </div>
                                    </div>
                                    <div class="form-group col col-md-6">
                                        <!--label>Date</label-->
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-addon">
                                                <span class="fa fa-calendar"></span>
                                            </span>
                                            <input type="text" placeholder="01-01-2015" class="form-control text-right"/>
                                        </div>
                                    </div>
                                </div>

                                <div class="row" style="margin-bottom: 0;">
                                    <div class="col col-md-12 text-center">
                                        <button class="btn btn-lg btn-link"><span class="fa fa-plus"></span> Add Leg</button>
                                        <button class="btn btn-lg btn-success"><span class="fa fa-calculator"></span> Calculate Compensation</button>
                                    </div>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="main-section container">
            <div class="row" id="claim-process">
                <div class="col-md-4">
                    <div class="text-center"><span class="circle">1</span></div>
                    <h3 class="text-center">Establish your eligibility</h3>
                    <p style="font-size: 1.2em; text-align: justify;">We examine whether your itinerary is subjected to <strong>compensation regulations</strong> for air travel (like EC 261/2004 and the Montreal Convention).</p>
                </div>
                <div class="col-md-4">
                    <div class="text-center"><span class="circle">2</span></div>
                    <h3 class="text-center">Calculate your compensation</h3>
                    <p style="font-size: 1.2em;text-align: justify;">We use your itinerary to calculate the reimbursement applicable to your situation. This will be displayed in an <strong>easy-to-read overview</strong>.</p>
                </div>
                <div class="col-md-4">
                    <div class="text-center"><span class="circle">3</span></div>
                    <h3 class="text-center">File your claim</h3>
                    <p style="font-size: 1.2em;text-align: justify;">We finish all the paperwork and file your claim directly to the airliner. You only pay a minor fee if your claim is granted, so <strong>no cure, no pay</strong>.</p>
                </div>
            </div>
        </section>
    </body>
</html>