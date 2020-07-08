<?php

namespace Tests;

use Faker\Factory;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, DatabaseMigrations, WithoutMiddleware;

    protected $faker;

    public function setUp(): void
    {
        parent::setUp();
        $this->faker = Factory::create();
        Artisan::call('passport:install');
    }
}
